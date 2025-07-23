'use client'

import { useEffect } from 'react'

export default function RemoveFormAttributes() {
  useEffect(() => {
    // Function to remove problematic attributes
    const removeAttributes = () => {
      // Remove from all elements with fdprocessedid
      document.querySelectorAll('[fdprocessedid]').forEach(el => {
        el.removeAttribute('fdprocessedid')
      })
      
      // Also remove from form elements that might get processed later
      const formElements = ['input', 'button', 'textarea', 'select', 'form']
      formElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.hasAttribute('fdprocessedid')) {
            el.removeAttribute('fdprocessedid')
          }
        })
      })
    }

    // Run immediately
    removeAttributes()
    
    // Set up a MutationObserver to catch dynamically added elements
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          needsUpdate = true
        }
      })
      if (needsUpdate) {
        removeAttributes()
      }
    })

    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['fdprocessedid']
    })

    // Also run periodically as a fallback
    const interval = setInterval(removeAttributes, 2000)
    
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  return null
}
