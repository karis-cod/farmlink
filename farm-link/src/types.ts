export interface Product {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  unit: string
  image?: string
  description: string
}

export interface Farmer {
  id: string
  name: string
  location: string
  products: Product[]
  rating: number
  reviews: number
  bio: string
  image?: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'farmer'
  farmerId: string
  farmerName: string
  message: string
  timestamp: Date
  productId?: string
  productName?: string
}

export interface Negotiation {
  id: string
  farmerId: string
  farmerName: string
  productId: string
  productName: string
  originalPrice: number
  proposedPrice: number
  quantity: number
  status: 'pending' | 'accepted' | 'rejected'
  messages: ChatMessage[]
  createdAt: Date
}
