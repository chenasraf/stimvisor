import { HtmlProps } from '@/common/types'
import React, { useCallback, useMemo } from 'react'
import { cn } from '@/common/utils'
import { Link, useLocation } from 'react-router-dom'
import { cva } from 'class-variance-authority'
import LogoSvg from '@/assets/images/logo.svg'

export function MainSidebar({ className, ...rest }: HtmlProps<'div'>) {
  return (
    <div className={cn('py-3 bg-black/30 h-screen overflow-y-auto', className)} {...rest}>
      <Link className="text-2xl px-5 py-2 flex items-center gap-4" to="/">
        <img className="h-10 w-auto" src={LogoSvg} alt="SV" />
        StimVisor
      </Link>
      <ul>
        <ListItem label="Games" to="/games" match={(p) => p === '/' || p.startsWith('/games')} />
        <ListItem
          label="Screenshots"
          to="/screenshots"
          match={(p) => p.startsWith('/screenshots')}
        />
        <ListItem label="Save Data" to="/saves" />
      </ul>
    </div>
  )
}

const liStyles = cva(
  'min-h-10 flex items-center justify-start py-3 px-6 cursor-pointer transition-colors',
  {
    variants: {
      active: {
        true: 'bg-bg-800 hover:bg-bg-800',
        false: 'hover:bg-bg-800',
      },
    },
  },
)

function ListItem({
  children,
  label,
  to,
  match = true,
  ...rest
}: HtmlProps<'div'> & {
  label: React.ReactNode
  to: string
  match?: boolean | string | ((_path: string) => boolean)
}) {
  const path = useLocation().pathname
  const defaultMatchFn = useCallback(
    (path: string) => path === (match === true ? to : match),
    [match, to],
  )
  const active = useMemo(() => {
    const fnMatch = typeof match === 'function' ? match : defaultMatchFn
    return fnMatch(path)
  }, [defaultMatchFn, match, path])
  const cls = liStyles({ active })
  return (
    <Link to={to}>
      <div className={cls} {...rest}>
        {label}
      </div>
      {children ? <ul>{children}</ul> : null}
    </Link>
  )
}
