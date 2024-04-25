import {createContext, useEffect, useState} from 'react'
import {fetchTasksUrl} from '../../../../../api/TasksApi'

export const AppContext = createContext()

export const AppContextProvider = ({children}) => {
  const [tasksData, setTasksData] = useState([])
  const ownerUserId = Number(sessionStorage.getItem('userId'))
  const reload = async () => {
    try {
      const data = await fetchTasksUrl(ownerUserId)
      setTasksData(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    reload()
  }, [])
  return <AppContext.Provider value={{tasksData}}>{children}</AppContext.Provider>
}
