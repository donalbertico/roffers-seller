import * as React from 'react'
import { DataStore, Auth, API, Hub} from 'aws-amplify'
import { Seller, Offer } from '../models/index.js'
import { useUser } from '../context/userContext'
import { useSeller } from '../context/sellerContext'

export default function DashboardScreen(props){
  const [user, setUser] = useUser()
  const [seller, setSeller] = useSeller()
  const [dataStoreready, setDSReady] = React.useState(false)
  const [offers, setOffers] = React.useState([])

  const createSellerProfile = () => {
    API.post('sellerApi','/seller/create',{
      body : {
        username : user.username,
        name: seller.name
      }
    })
    .then((res) => setSeller(res))
    .catch(err => console.log()(err))
  }
  const createOffer = async () => {
    try {
      await DataStore.save(
        new Offer({
          name : 'ploexa',
          owner : user.username,
          sellerID : seller.id
        }))
      getOffers()
    } catch (e) {
      console.log(e);
    }
  }
  const getOffers = () => {
    DataStore.query(Offer).then(r => setOffers(r)).catch(e => console.log(e))
  }
  const logout = () => {
    Auth.signOut()
  }
  const getSellers = async () => {
    console.log('bring seller');
    try {
      let sellers = await DataStore.query(Seller)
      if (sellers[0]) {
        setSeller(sellers[0])
      }
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    console.log('called');
    if(dataStoreready) {
      if(user?.username && seller == false) {
        getSellers()
      }else if(user && seller && seller.creating) {
        console.log('create');
        createSellerProfile()
      }else if(user && seller && seller.verified){
        getOffers()
        console.log('bring offers');
      }
    }
  },[user, seller, dataStoreready])
  React.useEffect(() => {
    console.log(offers);
  },[offers])
  React.useEffect(() => {
    const removeListener = Hub.listen('datastore', async (capsule) => {
      const { payload : {event, data}} = capsule
      if (event === 'ready') {
        setDSReady(true)
      }
    })

    DataStore.start()
    return () => {
      removeListener()
      setDSReady(false)
      DataStore.clear()
    }
  },[])


  return (
    <div>
      dashboard benvenuti
      { seller?.creating ? (
        <div>your seller profile is beign created</div>
      ) : (
        seller.verified == false ? (
          <div>
            holi {seller.name}
            your profile is beign reviewed
          </div>
        ) : (
          <div>
            holi {seller.name}
            wellcome
            <button onClick={createOffer}>new offer</button>
          </div>
        )
      )}
      <button onClick={logout}>logout</button>

    </div>
  )
}
