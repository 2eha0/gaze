/**
 * Group Widget
 * Exports widget definition for registration
 */

import type { WidgetDefinition } from '../../types/widget'
import GroupWidgetAstro from './GroupWidgetAstro.astro'
import { groupFetcher } from './fetcher'
import type { GroupData, GroupWidgetConfigBase } from './types'

export const groupWidget: WidgetDefinition<GroupWidgetConfigBase, GroupData> = {
  component: GroupWidgetAstro,
  fetcher: groupFetcher,
  frameless: true,
}

export type { GroupData, GroupWidgetConfigBase }
