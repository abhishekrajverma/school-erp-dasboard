import { createResourceApi } from './create-resource-api'
import type { TransportRouteDto, TransportVehicleDto } from './types/resources'

export const transportApi = {
  routes: createResourceApi<TransportRouteDto>('/transport/routes'),
  vehicles: createResourceApi<TransportVehicleDto>('/transport/vehicles'),
}
