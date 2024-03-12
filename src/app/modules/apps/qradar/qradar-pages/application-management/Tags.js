
import {useEffect, useState} from 'react'
import {fetchAEndPointDetailsUrl} from '../../../../../api/ApplicationSectionApi'

function Tags({id}) {
  const orgId = Number(sessionStorage.getItem('orgId'))
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState([])
  console.log(tags, 'tags')
  const fetchData = async () => {
    const data = {
      orgID: orgId,
      endPiontId: id,
    }
    try {
      setLoading(true)
      const response = await fetchAEndPointDetailsUrl(data)
      const [firstEndpoint] = response
      setTags(firstEndpoint.tags)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div>
    {tags === null && (
        <p>No data found</p>
    )}
</div>

  )
}

export default Tags
