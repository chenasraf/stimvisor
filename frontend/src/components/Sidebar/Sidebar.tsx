import { HtmlProps } from '../../common/types'
import React from 'react'
import { cn } from '../../common/utils'
import { Link } from 'react-router-dom'

export function Sidebar({ className, ...rest }: HtmlProps<'div'>) {
  return (
    <div className={cn('py-3 bg-bg-800 h-screen overflow-y-auto', className)} {...rest}>
      <ul>
        <ListItem label="Games" to="/games" />
        <ListItem label="Screenshots" to="/screenshots" />
        <ListItem label="Save Data" to="/saves" />
      </ul>
    </div>
  )
}

function ListItem({
  children,
  label,
  to,
  ...rest
}: HtmlProps<'div'> & { label: React.ReactNode; to: string }) {
  // TODO should be siblings under a fragment, use li instead of div for props ^
  return (
    <Link to={to}>
      <div
        className="min-h-10 flex items-center justify-start py-3 px-6 hover:bg-bg-700 cursor-pointer"
        {...rest}
      >
        {label}
      </div>
      {children ? <ul>{children}</ul> : null}
    </Link>
  )
}
