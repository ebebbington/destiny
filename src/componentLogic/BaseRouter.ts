import { xml, Component, match } from "../mod.ts"

export type Routes = Map<string, { content: string, exact?: boolean }>

export class BaseRouter extends Component {
    protected render(data: { content: string, matches: Record<string, string>}) {
      console.log('gonna render comp with:')
      console.log(data)
        return xml`
        <${import(data.content)}
          prop:pathparams=${data.matches}
          prop:fallback=${xml`Loading…`}
          prop:catch=${(err: Error) => xml`
            Error loading page: ${err.message}`
          }
        />`
      }

    protected tryMatchRoute(routes: Routes, requestUri: string): undefined | { content: string, matches: Record<string, string>} {
        let routeInfo = routes.get(requestUri);
        if (routeInfo) {
            return {
              content: routeInfo.content,
              matches: {}
            }
        }
        // Otherwise try match against all routes
        let matches = {}
        for (const routeUri of routes.keys()) {
          matches = match(routeUri)(requestUri)
          if (matches !== false) {
              // this route matches :)
              routeInfo = routes.get(routeUri)
              break
          }
        }
        return routeInfo ? { content: routeInfo.content, matches: matches } : undefined
    }
}