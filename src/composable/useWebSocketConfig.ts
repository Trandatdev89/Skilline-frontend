import { onUnmounted, ref } from 'vue'
import SockJS from 'sockjs-client'
import { Client, type StompSubscription } from '@stomp/stompjs'

export const useWebSocketConfig = () => {
  let client: Client | null = null
  const isConnect = ref<boolean>(false)
  const subscriptions = new Map<string, StompSubscription>()

  const connectStomp = (): Promise<void> => {
    return new Promise((resolve, reject) => {

      client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling']
        }),
        debug: (msg) => console.log('STOMP:', msg),
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect() {
          isConnect.value = true
          resolve() // ← Báo hiệu connect xong
        },
        onDisconnect() {
          isConnect.value = false
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame)
          reject(frame) // ← Báo lỗi nếu connect thất bại
        }
      })

      client.activate()
    })
  }

  const disconnect = () => {
    subscriptions.forEach((sub) => sub.unsubscribe())
    subscriptions.clear()
    client?.deactivate()
    client = null
    isConnect.value = false
  }

  // Subscribe với key để dễ quản lý
  const subscribe = (
    destination: string,
    callback: (message: any) => void,
    key?: string
  ): StompSubscription | undefined => {
    if (!client || !isConnect.value) {
      console.warn('WebSocket chưa kết nối')
      return
    }

    const sub = client.subscribe(destination, (message) => {
      callback(JSON.parse(message.body))
    })

    // Lưu lại để unsubscribe sau
    const subKey = key ?? destination
    subscriptions.set(subKey, sub)

    return sub
  }

  const unsubscribe = (key: string) => {
    subscriptions.get(key)?.unsubscribe()
    subscriptions.delete(key)
  }

  const publish = (destination: string, body: any) => {
    if (!client || !isConnect.value) {
      console.error('Client chưa kết nối')
      return
    }
    client.publish({ destination, body: JSON.stringify(body) })
  }

  // Tự động cleanup khi component unmount
  onUnmounted(() => {
    disconnect()
  })

  return { isConnect, connectStomp, disconnect, subscribe, unsubscribe, publish }
}