import { xml, Component, match } from "../mod.ts"
import { getElementData } from "../mod.ts"

export type Routes = Map<string, { content: string, exact: boolean }>

const cachedMatches = reactive(new Map())

export class BaseRouter extends Component {
  protected assignRoutes() {
    const map = new Map()
    for (const child of this.children) {
      const data = getElementData(child)
      const props = data!.prop
      const path = props.get("path") as string
      const content = props.get("content") as string
      const exact = props.get("exact") as boolean ?? false
      if (!path || !content) {
        throw new Error("ya dun fucked up a-a-ron")
      }
      map.set(path, {
        content,
        exact
      })
    }
    return map;
  }
    protected render(data: { content: string, matches: Record<string, string>}) {
      // TODO(edward/okku): Currently theres a bug with the below props aren't being passed into the component, but once that is fixed, passing path params should also work
      // TODO(edward/okku): Once we can use a spreadoperator eg prop:destinySlot=${...obj}, we shpuld probably go for that?
        return xml`
        <${import(data.content)}
          prop:pathParams=${data.matches}
          prop:fallback=${xml`Loading…`}
          prop:catch=${(err: Error) => xml`
            Error loading page: ${err.message}`
          }
        />`
      }

    protected tryMatchRoute(routes: Routes, requestUri: string): undefined | { content: string, matches: Record<string, string>} {
        // check cache
        const matchFromCache = cachedMatches.get(requestUri)
        if (matchFromCache) {
          return {
            content: matchFromCache.content,
            matches: matchFromCache.matches
          }
        }
        // match route exactly
        {
          const routeInfo = routes.get(requestUri);
          if (routeInfo) {
            if (!matchFromCache) {
              cachedMatches.set(requestUri, {
                content: routeInfo.content,
                matches: {}
              })
            }
            return {
              content: routeInfo.content,
              matches: {}
            }
          }
        }
        {
          // Otherwise try match against all routes
          const matches = {}
          let routeInfo;
          for (const routeUri of routes.keys()) {
            matches = match(routeUri)(requestUri)
            if (matches !== false) {
                // this route matches :)
                routeInfo = routes.get(routeUri)
                cachedMatches.set(requestUri, {
                  content: routeInfo.content,
                  matches
                })
                break
            }
          }
          if (routeInfo) {
            return {
              content: routeInfo.content,
              matches
            }
          }
        }
        return undefined
    }
}