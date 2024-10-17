import { useApi } from '../../common/api'
import { GetSteamLibraryMeta } from '../../../wailsjs/go/main/App'
import { HtmlProps } from '../../common/types'
import React from 'react'
import { cn } from '../../common/utils'

export function Sidebar({ className, ...rest }: HtmlProps<'div'>) {
  const { data } = useApi(() => GetSteamLibraryMeta(), { initialData: {} as never, debug: true })
  const { steamDir } = data

  return (
    <div className={cn('py-3 bg-bg-800 h-screen overflow-y-auto', className)} {...rest}>
      <ul>
        <ListItem label="Games" />
        <ListItem label="Screenshots" />
        <ListItem label="Save Data" />
      </ul>
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
    </div>
  )
}

function ListItem({ children, label, ...rest }: HtmlProps<'div'> & { label: React.ReactNode }) {
  // TODO should be siblings under a fragment, use li instead of div for props ^
  return (
    <li>
      <div
        className="min-h-10 flex items-center justify-start py-3 px-6 hover:bg-bg-700 cursor-pointer"
        {...rest}
      >
        {label}
      </div>
      {children ? <ul>{children}</ul> : null}
    </li>
  )
}
