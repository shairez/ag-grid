export declare const _: {
    utf8_encode(s: string | null): string;
    camelCaseToHyphen(str: string): string | null;
    hyphenToCamelCase(str: string): string | null;
    capitalise(str: string): string;
    escapeString(toEscape: string | null): string | null;
    camelCaseToHumanText(camelCase: string | undefined): string | null;
    startsWith(str: string, matchStart: string): boolean;
    convertToSet<T>(list: T[]): Set<T>;
    sortRowNodesByOrder(rowNodes: import("../main").RowNode[], rowNodeOrder: {
        [id: string]: number;
    }): void;
    traverseNodesWithKey(nodes: import("../main").RowNode[] | null, callback: (node: import("../main").RowNode, key: string) => void): void;
    iterateObject<T_1>(object: {
        [p: string]: T_1;
    } | T_1[] | null | undefined, callback: (key: string, value: T_1) => void): void;
    cloneObject<T_2>(object: T_2): T_2;
    deepCloneObject<T_3>(object: T_3): T_3;
    deepCloneDefinition<T_4>(object: T_4, keysToSkip?: string[] | undefined): T_4 | undefined;
    getProperty<T_5, K extends keyof T_5>(object: T_5, key: K): any;
    setProperty<T_6, K_1 extends keyof T_6>(object: T_6, key: K_1, value: any): void;
    copyPropertiesIfPresent<S, T_7 extends S, K_2 extends keyof S>(source: S, target: T_7, ...properties: K_2[]): void;
    copyPropertyIfPresent<S_1, T_8 extends S_1, K_3 extends keyof S_1>(source: S_1, target: T_8, property: K_3, transform?: ((value: S_1[K_3]) => any) | undefined): void;
    getAllKeysInObjects(objects: any[]): string[];
    mergeDeep(dest: any, source: any, copyUndefined?: boolean, makeCopyOfSimpleObjects?: boolean): void;
    assign<T_9, U>(target: T_9, source: U): T_9 & U;
    assign<T_10, U_1, V>(target: T_10, source1: U_1, source2: V): T_10 & U_1 & V;
    assign<T_11, U_2, V_1, W>(target: T_11, source1: U_2, source2: V_1, source3: W): T_11 & U_2 & V_1 & W;
    missingOrEmptyObject(value: any): boolean;
    get(source: any, expression: string, defaultValue: any): any;
    set(target: any, expression: string, value: any): void;
    deepFreeze(object: any): any;
    getValueUsingField(data: any, field: string, fieldContainsDots: boolean): any;
    removeAllReferences(obj: any, objectName: string): void;
    isNonNullObject(value: any): boolean;
    padStart(value: number, totalStringSize: number): string;
    createArrayOfNumbers(first: number, last: number): number[];
    isNumeric(value: any): boolean;
    getMaxSafeInteger(): number;
    cleanNumber(value: any): number | null;
    decToHex(number: number, bytes: number): string;
    formatNumberTwoDecimalPlacesAndCommas(value: number): string;
    formatNumberCommas(value: number): string;
    sum(values: number[] | null): number | null;
    normalizeWheel(event: any): any;
    isLeftClick(mouseEvent: MouseEvent): boolean;
    areEventsNear(e1: Touch | MouseEvent, e2: Touch | MouseEvent, pixelCount: number): boolean;
    keys<T_12>(map: Map<T_12, any>): T_12[];
    isKeyPressed(event: KeyboardEvent, keyToCheck: number): boolean;
    isEventFromPrintableCharacter(event: KeyboardEvent): boolean;
    isUserSuppressingKeyboardEvent(gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, keyboardEvent: KeyboardEvent, rowNode: import("../main").RowNode, column: import("../main").Column, editing: boolean): boolean;
    isUserSuppressingHeaderKeyboardEvent(gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, keyboardEvent: KeyboardEvent, headerRowIndex: number, column: import("../main").Column | import("../main").ColumnGroup): boolean;
    createIcon(iconName: string, gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, column: import("../main").Column | null): HTMLElement;
    createIconNoSpan(iconName: string, gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, column?: import("../main").Column | null | undefined, forceCreate?: boolean | undefined): HTMLElement | undefined;
    iconNameClassMap: {
        [key: string]: string;
    };
    makeNull<T_13 extends unknown>(value?: T_13 | undefined): T_13 | null;
    exists(value: string | null | undefined, allowEmptyString?: boolean | undefined): value is string;
    exists<T_14>(value: T_14): value is NonNullable<T_14>;
    missing<T_15>(value: T_15 | null | undefined): value is Exclude<undefined, T_15> | Exclude<null, T_15>;
    missingOrEmpty<T_16>(value?: string | T_16[] | null | undefined): boolean;
    toStringOrNull(value: any): string | null;
    attrToNumber(value?: string | number | null | undefined): number | null | undefined;
    attrToBoolean(value?: string | boolean | null | undefined): boolean | undefined;
    attrToString(value?: string | undefined): string | undefined;
    referenceCompare<T_17>(left: T_17, right: T_17): boolean;
    jsonEquals<T1, T2>(val1: T1, val2: T2): boolean;
    defaultComparator(valueA: any, valueB: any, accentedCompare?: boolean): number;
    find<T_18>(collection: {
        [id: string]: T_18;
    } | T_18[] | null, predicate: string | boolean | ((item: T_18) => boolean), value?: any): T_18 | null;
    values<T_19>(object: {
        [key: string]: T_19;
    } | Set<T_19> | Map<any, T_19>): T_19[];
    fuzzyCheckStrings(inputValues: string[], validValues: string[], allSuggestions: string[]): {
        [p: string]: string[];
    };
    fuzzySuggestions(inputValue: string, allSuggestions: string[], hideIrrelevant?: boolean | undefined, weighted?: true | undefined): string[];
    get_bigrams(from: string): any[];
    string_distances(str1: string, str2: string): number;
    string_weighted_distances(str1: string, str2: string): number;
    doOnce(func: () => void, key: string): void;
    getFunctionName(funcConstructor: any): any;
    getFunctionParameters(func: any): any;
    isFunction(val: any): boolean;
    executeInAWhile(funcs: Function[]): void;
    executeNextVMTurn(funcs: Function[]): void;
    executeAfter(funcs: Function[], milliseconds?: number): void;
    debounce(func: (...args: any[]) => void, wait: number, immediate?: boolean): (...args: any[]) => void;
    compose(...fns: Function[]): (arg: any) => any;
    callIfPresent(func: Function): void;
    stopPropagationForAgGrid(event: Event): void;
    isStopPropagationForAgGrid(event: Event): boolean;
    getCellCompForEvent(gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, event: Event): import("../main").CellComp | null;
    addChangeListener(element: HTMLElement, listener: EventListener): void;
    getTarget(event: Event): Element;
    isElementInEventPath(element: HTMLElement, event: Event): boolean;
    createEventPath(event: Event): EventTarget[];
    addAgGridEventPath(event: Event): void;
    getEventPath(event: Event): EventTarget[];
    addSafePassiveEventListener(frameworkOverrides: import("../main").IFrameworkOverrides, eElement: HTMLElement, event: string, listener: (event?: any) => void): void;
    isEventSupported: (eventName: any) => boolean;
    addCssClass(element: HTMLElement, className: string): HTMLElement | undefined;
    removeCssClass(element: HTMLElement, className: string): void;
    addOrRemoveCssClass(element: HTMLElement, className: string, addOrRemove: boolean): void;
    radioCssClass(element: HTMLElement, elementClass: string | null, otherElementClass?: string | null | undefined): void;
    containsClass(element: HTMLElement, className: string): boolean;
    isFocusableFormField(element: HTMLElement): boolean;
    setDisplayed(element: HTMLElement, displayed: boolean): void;
    setVisible(element: HTMLElement, visible: boolean): void;
    setDisabled(element: HTMLElement, disabled: boolean): void;
    isElementChildOfClass(element: HTMLElement | null, cls: string, maxNest?: number | undefined): boolean;
    getElementSize(el: HTMLElement): {
        height: number;
        width: number;
        paddingTop: number;
        paddingRight: number;
        paddingBottom: number;
        paddingLeft: number;
        marginTop: number;
        marginRight: number;
        marginBottom: number;
        marginLeft: number;
        boxSizing: string;
    };
    getInnerHeight(el: HTMLElement): number;
    getInnerWidth(el: HTMLElement): number;
    getAbsoluteHeight(el: HTMLElement): number;
    getAbsoluteWidth(el: HTMLElement): number;
    isRtlNegativeScroll(): boolean;
    getScrollLeft(element: HTMLElement, rtl: boolean): number;
    setScrollLeft(element: HTMLElement, value: number, rtl: boolean): void;
    clearElement(el: HTMLElement): void;
    removeElement(parent: HTMLElement, cssSelector: string): void;
    removeFromParent(node: Element | null): void;
    isVisible(element: HTMLElement): boolean;
    loadTemplate(template: string): HTMLElement;
    appendHtml(eContainer: HTMLElement, htmlTemplate: string): void;
    getElementAttribute(element: any, attributeName: string): string | null;
    offsetHeight(element: HTMLElement): number;
    offsetWidth(element: HTMLElement): number;
    ensureDomOrder(eContainer: HTMLElement, eChild: HTMLElement, eChildBefore?: HTMLElement | null | undefined): void;
    setDomChildOrder(eContainer: HTMLElement, orderedChildren: (HTMLElement | null)[]): void;
    insertTemplateWithDomOrder(eContainer: HTMLElement, htmlTemplate: string, eChildBefore: HTMLElement | null): HTMLElement;
    prependDC(parent: HTMLElement, documentFragment: DocumentFragment): void;
    addStylesToElement(eElement: any, styles: any): void;
    isHorizontalScrollShowing(element: HTMLElement): boolean;
    isVerticalScrollShowing(element: HTMLElement): boolean;
    setElementWidth(element: HTMLElement, width: string | number): void;
    setFixedWidth(element: HTMLElement, width: string | number): void;
    setElementHeight(element: HTMLElement, height: string | number): void;
    setFixedHeight(element: HTMLElement, height: string | number): void;
    formatSize(size: string | number): string;
    isNode(o: any): boolean;
    isElement(o: any): boolean;
    isNodeOrElement(o: any): boolean;
    copyNodeList(nodeList: NodeListOf<Node> | null): Node[];
    iterateNamedNodeMap(map: NamedNodeMap, callback: (key: string, value: string) => void): void;
    setCheckboxState(eCheckbox: HTMLInputElement, state: any): void;
    addOrRemoveAttribute(element: HTMLElement, name: string, value: any): void;
    nodeListForEach<T_20 extends Node>(nodeList: NodeListOf<T_20> | null, action: (value: T_20) => void): void;
    serialiseDate(date: Date | null, includeTime?: boolean, separator?: string): string | null;
    parseDateTimeFromString(value?: string | null | undefined): Date | null;
    stringToArray(strData: string, delimiter?: string): string[][];
    isBrowserIE(): boolean;
    isBrowserEdge(): boolean;
    isBrowserSafari(): boolean;
    isBrowserChrome(): boolean;
    isBrowserFirefox(): boolean;
    isIOSUserAgent(): boolean;
    getTabIndex(el: HTMLElement | null): string | null;
    getMaxDivHeight(): number;
    getScrollbarWidth(): number | null;
    hasOverflowScrolling(): boolean;
    getBodyWidth(): number;
    getBodyHeight(): number;
    firstExistingValue<A>(...values: A[]): A | null;
    anyExists(values: any[]): boolean;
    existsAndNotEmpty<T_21>(value?: T_21[] | undefined): boolean;
    last<T_22>(arr: T_22[]): T_22;
    last<T_23 extends Node>(arr: NodeListOf<T_23>): T_23;
    areEqual<T_24>(a?: T_24[] | null | undefined, b?: T_24[] | null | undefined, comparator?: ((a: T_24, b: T_24) => boolean) | undefined): boolean;
    compareArrays(array1?: any[] | undefined, array2?: any[] | undefined): boolean;
    shallowCompare(arr1: any[], arr2: any[]): boolean;
    sortNumerically(array: number[]): number[];
    removeRepeatsFromArray<T_25>(array: T_25[], object: T_25): void;
    removeFromArray<T_26>(array: T_26[], object: T_26): void;
    removeAllFromArray<T_27>(array: T_27[], toRemove: T_27[]): void;
    insertIntoArray<T_28>(array: T_28[], object: T_28, toIndex: number): void;
    insertArrayIntoArray<T_29>(dest: T_29[], src: T_29[], toIndex: number): void;
    moveInArray<T_30>(array: T_30[], objectsToMove: T_30[], toIndex: number): void;
    includes<T_31>(array: T_31[], value: T_31): boolean;
    flatten(arrayOfArrays: any[]): any[];
    pushAll<T_32>(target: T_32[], source: T_32[]): void;
    toStrings<T_33>(array: T_33[]): (string | null)[] | null;
    findIndex<T_34>(collection: T_34[], predicate: (item: T_34, idx: number, collection: T_34[]) => boolean): number;
    every<T_35>(list: T_35[], predicate: (value: T_35, index: number) => boolean): boolean;
    some<T_36>(list: T_36[], predicate: (value: T_36, index: number) => boolean): boolean;
    forEach<T_37>(list: T_37[], action: (value: T_37, index: number) => void): void;
    forEachReverse<T_38>(list: T_38[], action: (value: T_38, index: number) => void): void;
    map<T_39, V_2>(list: T_39[], process: (value: T_39, index: number) => V_2): V_2[] | null;
    filter<T_40>(list: T_40[], predicate: (value: T_40, index: number) => boolean): T_40[] | null;
    reduce<T_41, V_3>(list: T_41[], step: (acc: V_3, value: T_41, index: number) => V_3, initial: V_3): V_3 | null;
    forEachSnapshotFirst<T_42>(list: T_42[], callback: (item: T_42) => void): void;
    getAriaSortState(column: import("../main").Column): "none" | "ascending" | "descending";
    getAriaLevel(element: HTMLElement): number;
    getAriaPosInSet(element: HTMLElement): number;
    setAriaLabel(element: HTMLElement, label: string): void;
    setAriaLabelledBy(element: HTMLElement, labelledBy: string): void;
    setAriaDescribedBy(element: HTMLElement, describedby: string): void;
    setAriaLevel(element: HTMLElement, level: number): void;
    setAriaDisabled(element: HTMLElement, disabled: boolean): void;
    setAriaExpanded(element: HTMLElement, expanded: boolean): void;
    removeAriaExpanded(element: HTMLElement): void;
    setAriaSetSize(element: HTMLElement, setsize: number): void;
    setAriaPosInSet(element: HTMLElement, position: number): void;
    setAriaMultiSelectable(element: HTMLElement, multiSelectable: boolean): void;
    setAriaRowCount(element: HTMLElement, rowCount: number): void;
    setAriaRowIndex(element: HTMLElement, rowIndex: number): void;
    setAriaColCount(element: HTMLElement, colCount: number): void;
    setAriaColIndex(element: HTMLElement, colIndex: number): void;
    setAriaColSpan(element: HTMLElement, colSpan: number): void;
    setAriaSort(element: HTMLElement, sort: "none" | "ascending" | "descending"): void;
    removeAriaSort(element: HTMLElement): void;
    setAriaSelected(element: HTMLElement, selected: boolean): void;
    setAriaChecked(element: HTMLElement, checked?: boolean | undefined): void;
    getNameOfClass(theClass: any): string;
    findLineByLeastSquares(values: number[]): number[];
    cssStyleObjectToMarkup(stylesToUse: any): string;
    message(msg: string): void;
    bindCellRendererToHtmlElement(cellRendererPromise: import("./promise").AgPromise<import("../main").ICellRendererComp>, eTarget: HTMLElement): void;
};
