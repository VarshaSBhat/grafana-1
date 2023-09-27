+++
# -----------------------------------------------------------------------
# Do not edit this file. It is automatically generated by API Documenter.
# -----------------------------------------------------------------------
title = "useStyles"
keywords = ["grafana","documentation","sdk","@grafana/ui"]
type = "docs"
+++

## useStyles() function

### useStyles() function

Hook for using memoized styles with access to the theme.

NOTE: For memoization to work, you need to ensure that the function you pass in doesn't change, or only if it needs to. (i.e. declare your style creator outside of a function component or use `useCallback()`<!-- -->.)

<b>Signature</b>

```typescript
export declare function useStyles<T>(getStyles: (theme: GrafanaTheme) => T): T;
```
<b>Import</b>

```typescript
import { useStyles } from '@grafana/ui';
```
<b>Parameters</b>

|  Parameter | Type | Description |
|  --- | --- | --- |
|  getStyles | <code>(theme: GrafanaTheme) =&gt; T</code> |  |

<b>Returns:</b>

`T`
