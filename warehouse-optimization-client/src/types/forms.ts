// Form types for the application

export type ItemUploadFormData = {
  name: string;
  description: string;
  expected_delivery_time: string;
  delivery_type: 'pickup' | 'delivery';
  awb_id: string;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
}

export type RiderUploadFormData = {
  name: string;
  age: number;
  bag_volume: number;
  phone_number: string;
}

export type PickupItemFormData = {
  name: string;
  description: string;
  expected_delivery_time: string;
  awb_id: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
}

export type DispatchFormData = {
  delivery_task_ids: string[];
  rider_ids: string[];
}

export type ScanFormData = {
  weight: number;
  volume: number;
}