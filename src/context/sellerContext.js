import * as React from 'react'

const SellerContext = React.createContext()

function sellerReducer(state, action) {
  switch (action.type) {
    case 'UPDATE':
        return {...action.value}
      break;
  }
}

function SellerProvider(props) {
  const [state, dispatch] = React.useReducer(sellerReducer, props.seller)
  const value = React.useMemo(() => [state, dispatch], [state])
  return <SellerContext.Provider value={value} {...props}/>
}

function useSeller() {
  const context = React.useContext(SellerContext)
  if(!context) throw new Error('useSeller must be used within context')

  const [state, dispatch] = context
  const update = (value) => dispatch({ type : 'UPDATE', value})
  return [
    state,
    update
  ]
}

export { SellerProvider, useSeller}
