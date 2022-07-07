import Location from '../models/Location'
import EstimatedTime from '../models/EstimatedTime'

export default class EstimatedTimeCalculator {
    getEstimatedTime(location: Location, orderId: string): EstimatedTime {
        // for this ETA function:
        // ETA is always 1 hour
        // Store Location is always the original location
        const estimatedtime: EstimatedTime = {
            EstimatedTime: 1.0,
            StoreLocation: {
                lat: location.lat,
                long: location.long,
            },
            OrderId: orderId,
        }
        return estimatedtime as EstimatedTime
    }
}
