import {
    _,
    RowNodeSorter,
    SortedRowNode,
    SortOption,
    Autowired,
    Bean,
    ChangedPath,
    ColumnModel,
    PostConstruct,
    RowNode,
    BeanStub,
    WithoutGridCommon,
    PostSortRowsParams,
    RowNodeTransaction
} from "@ag-grid-community/core";

import { RowNodeMap } from "./clientSideRowModel";

@Bean('sortService')
export class SortService extends BeanStub {

    @Autowired('columnModel') private columnModel: ColumnModel;
    @Autowired('rowNodeSorter') private rowNodeSorter: RowNodeSorter;

    private postSortFunc: ((params: WithoutGridCommon<PostSortRowsParams>) => void) | undefined;

    @PostConstruct
    public init(): void {
        this.postSortFunc = this.gridOptionsWrapper.getPostSortFunc();
    }

    public sort(
        sortOptions: SortOption[],
        sortActive: boolean,
        useDeltaSort: boolean,
        rowNodeTransactions: RowNodeTransaction[] | null | undefined,
        changedPath: ChangedPath | undefined,
        notAggregating: boolean,
        sortContainsGroupColumns: boolean,
    ): void {
        const groupMaintainOrder = this.gridOptionsWrapper.isGroupMaintainOrder();
        const groupColumnsPresent = this.columnModel.getAllGridColumns().some(c => c.isRowGroupActive());

        const staleNodes: RowNodeMap = {};
        const updatedNodes: { [key: string]: RowNode[] } = {};
        if (useDeltaSort && rowNodeTransactions) {
            this.flattenTransactions(rowNodeTransactions, staleNodes, updatedNodes)
        }

        const callback = (rowNode: RowNode) => {
            // we clear out the 'pull down open parents' first, as the values mix up the sorting
            this.pullDownGroupDataForHideOpenParents(rowNode.childrenAfterAggFilter, true);

            // Javascript sort is non deterministic when all the array items are equals, ie Comparator always returns 0,
            // so to ensure the array keeps its order, add an additional sorting condition manually, in this case we
            // are going to inspect the original array position. This is what sortedRowNodes is for.
            let skipSortingGroups = groupMaintainOrder && groupColumnsPresent && !rowNode.leafGroup && !sortContainsGroupColumns;
            if (!sortActive || skipSortingGroups) {
                // when 'groupMaintainOrder' is enabled we skip sorting groups unless we are sorting on group columns
                const childrenToBeSorted = rowNode.childrenAfterAggFilter!.slice(0);
                if (groupMaintainOrder && rowNode.childrenAfterSort) {
                    const indexedOrders = rowNode.childrenAfterSort.reduce<{ [key:string]: number }>(
                        (acc, row, idx) => {
                            acc[row.id!] = idx;
                            return acc;
                        }, {}
                    );
                    childrenToBeSorted.sort((row1, row2) => (indexedOrders[row1.id!] || 0) - (indexedOrders[row2.id!] || 0));
                }
                rowNode.childrenAfterSort = childrenToBeSorted;
            } else if (useDeltaSort) {
                rowNode.childrenAfterSort = this.doDeltaSort(rowNode, sortOptions, staleNodes, updatedNodes, notAggregating, changedPath!);
            } else {
                rowNode.childrenAfterSort = this.rowNodeSorter.doFullSort(rowNode.childrenAfterAggFilter!, sortOptions);
            }

            if (rowNode.sibling) {
                rowNode.sibling.childrenAfterSort = rowNode.childrenAfterSort;
            }

            this.updateChildIndexes(rowNode);

            if (this.postSortFunc) {
                const params: WithoutGridCommon<PostSortRowsParams> = { nodes: rowNode.childrenAfterSort };
                this.postSortFunc(params);
            }
        };

        if (changedPath) {
            changedPath.forEachChangedNodeDepthFirst(callback);
        }

        this.updateGroupDataForHideOpenParents(changedPath);
    }

    private flattenTransactions(rowNodeTransactions: RowNodeTransaction[], staleNodes: RowNodeMap, updatedNodes: { [key: string]: RowNode[] }) {
        rowNodeTransactions?.forEach(trans => {
            trans.add.forEach(node => {
                const nodeGroupKey = node.parent!.id!
                if (!updatedNodes[nodeGroupKey]) {
                    updatedNodes[nodeGroupKey] = [];
                }
                updatedNodes[nodeGroupKey].push(node);
            });

            // Treat updated nodes as both removed nodes and added nodes
            trans.update.forEach(node => {
                const nodeGroupKey = node.parent!.id!
                if (!updatedNodes[nodeGroupKey]) {
                    updatedNodes[nodeGroupKey] = [];
                }
                updatedNodes[nodeGroupKey].push(node);
                staleNodes[node.id!] = node;
            });

            trans.remove.forEach(node => {
                staleNodes[node.id!] = node;
            });
        });
    }

    private doDeltaSort(rowNode: RowNode, sortOptions: SortOption[], staleNodes: RowNodeMap, updatedNodes: { [key: string]: RowNode[] }, notAggregating: boolean, changedPath: ChangedPath) {
        if (!rowNode.childrenAfterAggFilter) {
            return [];
        }

        const stagnateRow = () => {
            if (rowNode.parent) {
                const isGroupNode = rowNode.group;
                const hasNoChildren = (rowNode.childrenAfterAggFilter?.length ?? 0) === 0;

                const isEmptyGroup = isGroupNode && hasNoChildren;

                if (isEmptyGroup) {
                    // Mark this node to be removed from its parent
                    staleNodes[rowNode.id!] = rowNode;
                    return;
                }

                // We're either aggregating or not a group, meaning the sort position could change
                const rowCanChange = !(isGroupNode && (notAggregating || changedPath.canSkip(rowNode)));
                // There's no prior sort position, so the row likely doesn't exist in its parent and needs added.
                const isNewGroup = isGroupNode && !rowNode.childrenAfterSort;
                if (rowCanChange || isNewGroup) {
                    // Change has happened, remove node
                    staleNodes[rowNode.id!] = rowNode;
                    
                    // Add node back to the parent as an update
                    if (!updatedNodes[rowNode.parent.id!]) {
                        updatedNodes[rowNode.parent.id!] = [rowNode];
                    } else {
                        updatedNodes[rowNode.parent.id!].push(rowNode);
                    }
                }
            }
        }

        // if there's no point sorting, then don't sort.
        if (rowNode.childrenAfterAggFilter.length <= 1) {
            stagnateRow()
            return [...rowNode.childrenAfterAggFilter];
        }

        const newNodes = updatedNodes[rowNode.id!];
        const numberOfUpdatedNodes = newNodes ? newNodes.length : 0;
        const isDeltaSortValuable = numberOfUpdatedNodes <= (rowNode.childrenAfterAggFilter.length || 0) / 2;
        if (!rowNode.childrenAfterSort || !isDeltaSortValuable) {
            // a full sort will happen, so it's possible the parent is now stale
            stagnateRow();
            return this.rowNodeSorter.doFullSort(rowNode.childrenAfterAggFilter!, sortOptions);
        }

        // there's no nodes here which are new or have changed
        const noAddOrUpdate = !newNodes || newNodes.length === 0;
        const childrenLengthUnchanged = rowNode.childrenAfterAggFilter.length === rowNode.childrenAfterSort?.length;

        // if nothing has been added or updated, and the remaining children length is unchanged, nothing to sort or filter.
        if (noAddOrUpdate && childrenLengthUnchanged) {
            return rowNode.childrenAfterSort;
        }

        // something has changed, mark this node as stale
        stagnateRow();

        const numberOfAddedRows = newNodes ? newNodes.length : 0;
        const isFilteringNeeded = rowNode.childrenAfterAggFilter.length !== rowNode.childrenAfterSort?.length + numberOfAddedRows;
        // if there's a change in the length of children, we can merely filter the already sorted list.

        let sortedRows = rowNode.childrenAfterSort;
        if (isFilteringNeeded) {
            // filter to remove all empty groups or stale nodes.
            sortedRows = rowNode.childrenAfterSort.filter(node => !staleNodes[node.id!] && node.childrenAfterAggFilter?.length !== 0);
        }

        // if nothing to add, filtered rows are final result
        if (noAddOrUpdate) {
            return sortedRows;
        }

        const newSortedNodes = newNodes
            .map(this.mapNodeToSortedNode)
            .sort((a: SortedRowNode, b: SortedRowNode) => this.rowNodeSorter.compareRowNodes(sortOptions, a, b));

        return this.mergeSortedArrays(sortOptions, sortedRows.map(this.mapNodeToSortedNode), newSortedNodes).map(n => n.rowNode);
    }

    private mapNodeToSortedNode(rowNode: RowNode, pos: number): SortedRowNode {
        return { currentPos: pos, rowNode: rowNode };
    }

    // Merge two sorted arrays into each other
    private mergeSortedArrays(sortOptions: SortOption[], arr1: SortedRowNode[], arr2: SortedRowNode[]) {
        const res = [];
        let i = 0;
        let j = 0;

        // Traverse both array, adding them in order
        while (i < arr1.length && j < arr2.length) {

            // Check if current element of first
            // array is smaller than current element
            // of second array. If yes, store first
            // array element and increment first array
            // index. Otherwise do same with second array
            const compareResult = this.rowNodeSorter.compareRowNodes(sortOptions, arr1[i], arr2[j]);
            if (compareResult < 0) {
                res.push(arr1[i++]);
            } else {
                res.push(arr2[j++]);
            }
        }

        // add remaining from arr1
        while (i < arr1.length) {
            res.push(arr1[i++]);
        }

        // add remaining from arr2
        while (j < arr2.length) {
            res.push(arr2[j++]);
        }

        return res;
    }

    private updateChildIndexes(rowNode: RowNode) {
        if (_.missing(rowNode.childrenAfterSort)) {
            return;
        }

        const listToSort = rowNode.childrenAfterSort;
        for (let i = 0; i < listToSort.length; i++) {
            const child = listToSort[i];
            const firstChild = i === 0;
            const lastChild = i === rowNode.childrenAfterSort.length - 1;
            child.setFirstChild(firstChild);
            child.setLastChild(lastChild);
            child.setChildIndex(i);
        }
    }

    private updateGroupDataForHideOpenParents(changedPath?: ChangedPath) {
        if (!this.gridOptionsWrapper.isGroupHideOpenParents()) {
            return;
        }

        if (this.gridOptionsWrapper.isTreeData()) {
            const msg = `AG Grid: The property hideOpenParents dose not work with Tree Data. This is because Tree Data has values at the group level, it doesn't make sense to hide them (as opposed to Row Grouping, which only has Aggregated Values at the group level).`;
            _.doOnce(() => console.warn(msg), 'sortService.hideOpenParentsWithTreeData');
            return false;
        }

        // recurse breadth first over group nodes after sort to 'pull down' group data to child groups
        const callback = (rowNode: RowNode) => {
            this.pullDownGroupDataForHideOpenParents(rowNode.childrenAfterSort, false);
            rowNode.childrenAfterSort!.forEach(child => {
                if (child.hasChildren()) {
                    callback(child);
                }
            });
        };

        if (changedPath) {
            changedPath.executeFromRootNode(rowNode => callback(rowNode));
        }
    }

    private pullDownGroupDataForHideOpenParents(rowNodes: RowNode[] | null, clearOperation: boolean) {
        if (!this.gridOptionsWrapper.isGroupHideOpenParents() || _.missing(rowNodes)) { return; }

        rowNodes.forEach(childRowNode => {
            const groupDisplayCols = this.columnModel.getGroupDisplayColumns();
            groupDisplayCols.forEach(groupDisplayCol => {

                const showRowGroup = groupDisplayCol.getColDef().showRowGroup;
                if (typeof showRowGroup !== 'string') {
                    console.error('AG Grid: groupHideOpenParents only works when specifying specific columns for colDef.showRowGroup');
                    return;
                }

                const displayingGroupKey = showRowGroup;
                const rowGroupColumn = this.columnModel.getPrimaryColumn(displayingGroupKey);
                const thisRowNodeMatches = rowGroupColumn === childRowNode.rowGroupColumn;

                if (thisRowNodeMatches) { return; }

                if (clearOperation) {
                    // if doing a clear operation, we clear down the value for every possible group column
                    childRowNode.setGroupValue(groupDisplayCol.getId(), undefined);
                } else {
                    // if doing a set operation, we set only where the pull down is to occur
                    const parentToStealFrom = childRowNode.getFirstChildOfFirstChild(rowGroupColumn);
                    if (parentToStealFrom) {
                        childRowNode.setGroupValue(groupDisplayCol.getId(), parentToStealFrom.key);
                    }
                }
            });
        });
    }
}
