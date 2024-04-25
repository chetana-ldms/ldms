import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {UsersListHeader} from './components/header/UsersListHeader'
import {UsersTable} from './table/UsersTable'
import {UserEditModal} from './user-edit-modal/UserEditModal'
import {KTCard} from '../../../../../_metronic/helpers'
import { ErrorFallbackComponent } from '../../../../../utils/ErrorFallbackComponent'
import { ErrorBoundary } from 'react-error-boundary'

const UsersList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <UsersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const QradarPagesWrapper = () => { 
  const handleError = (error: any, info: any) => {
    console.error("An error occurred:", error, info);
  };
  return(
  <ErrorBoundary
  FallbackComponent={ErrorFallbackComponent}
  onError={handleError}
>
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <UsersList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
  </ErrorBoundary>
  )
}

export {QradarPagesWrapper}
