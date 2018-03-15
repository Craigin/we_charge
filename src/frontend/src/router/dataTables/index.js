import schema from './schema'

const DataTable = resolve => require(['components/dataTable'], resolve)

const DATA_TABLE_ROUTES = schema.map(dataTable => {
  let {
    path,
    name,
    title,
    component,
    table
  } = dataTable

  return {
    path,
    name,
    component: component || DataTable,
    meta: {
      auth: true,
      title,
      table: {
        title,
        ...table
      }
    },
    props (route) {
      let {
        meta: {
          table
        }
      } = route
      return {
        schema: table
      }
    }
  }
})

export default DATA_TABLE_ROUTES
