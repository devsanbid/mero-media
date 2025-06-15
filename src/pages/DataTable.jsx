

import DataTable from "react-data-table-component"

const data = [
  { id: 1, name: 'sanbid', age: 20 },
  { id: 2, name: 'rahul', age: 22 },
  { id: 3, name: 'armit', age: 28 },
  { id: 4, name: 'saugat', age: 27 },
]

const columns = [
  {
    name: "Names",
    selector: row => row.name,
    sortable: true
  },
  {
    name: "age",
    selector: row => row.age,
    sortable: true
  },
]

export const DataTableComponent = () => {

  return <DataTable columns={columns} data={data} pagination/>


}
