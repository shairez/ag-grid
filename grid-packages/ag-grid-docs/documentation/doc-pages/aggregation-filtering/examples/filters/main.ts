import { Grid, GridOptions, ValueGetterParams } from '@ag-grid-community/core'

const gridOptions: GridOptions = {
  columnDefs: [
    { field: 'country', rowGroup: true, hide: true },
    { field: 'sport', rowGroup: true, hide: true },
    { field: 'athlete', hide: true },
    { field: 'year' },
    { field: 'total', aggFunc: 'sum', filter: 'agNumberColumnFilter' },
  ],
  defaultColDef: {
    flex: 1,
    filter: true,
    floatingFilter: true,
    resizable: true,
  },
  autoGroupColumnDef: {
    field: 'athlete',
    filterValueGetter: (params: ValueGetterParams) => params.data.athlete,
  },
  groupDefaultExpanded: -1,
  rowData: getData(),
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  new Grid(gridDiv, gridOptions)
})
