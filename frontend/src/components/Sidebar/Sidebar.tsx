import { useApi } from '../../common/api'
import { GetScreenshotsDirs } from '../../../wailsjs/go/main/App'

export function Sidebar() {
  const { data } = useApi<{ steamDir: string }>(() => GetScreenshotsDirs(), { initialData: {} })
  const { steamDir } = data

  return (
    <div>
      <ul className="my-3">
        <ListItem>Games</ListItem>
        <ListItem>
          <div>Screenshots</div>
          <ul>
            {[steamDir].map((item, i) => (
              <ListItem key={i} data-key={item}>
                {item}
              </ListItem>
            ))}
          </ul>
        </ListItem>
        <ListItem>Save Data</ListItem>
      </ul>
    </div>
  )
}

function ListItem({ children }: React.PropsWithChildren<object>) {
  return (
    <li className="h-10 flex items-center justify-start py-3 px-6 hover:bg-bg-800 cursor-pointer">
      {children}
    </li>
  )
}
