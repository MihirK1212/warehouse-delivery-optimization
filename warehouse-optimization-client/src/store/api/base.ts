// src/store/api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './utils/custom-query';


export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    tagTypes: [
        'Item',
        'DeliveryTask', 
        'Rider',
        'DeliveryTasksBatch'
    ]
});
