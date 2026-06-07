import { createResourceApi } from './create-resource-api'
import type { InventoryItemDto } from './types/resources'

export const inventoryApi = createResourceApi<InventoryItemDto>('/inventory/items')
