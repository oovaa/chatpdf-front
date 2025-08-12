import { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const DocumentProvidedContext = createContext(false)

export function DocumentProvidedProvider({ children }) {
  const [noDoc, setNoDoc] = useState(true)

  return (
    <DocumentProvidedContext.Provider value={{ noDoc, setNoDoc }}>
      {children}
    </DocumentProvidedContext.Provider>
  )
}

DocumentProvidedProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
