import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Bot,
  Send,
  Sparkles,
  User,
  ShoppingBag,
  Trash2,
  Heart,
  ShoppingCart,
} from 'lucide-react'
import { processShoppingQuery } from '../services/assistantService'
import { addToCart } from '../../../store/slices/cartSlice'
import { toggleWishlist } from '../../../store/slices/wishlistSlice'

const SUGGESTIONS = [
  'Show me smartphones under 30000',
  'Show me laptops with good ratings',
  'Find skincare products',
  'Add the cheapest product to cart',
]

const INITIAL_MESSAGE = {
  role: 'assistant',
  text: "Hi! I'm ShopSphere AI. 👋 Tell me what you're looking for, and I'll help you find the right products. You can also ask me to add a result to your cart or wishlist.",
  products: [],
}

const handleFollowUpQuery = (
  message,
  previousResults,
  displayedProducts
) => {
  const text = message.toLowerCase()

  if (!previousResults.length || !displayedProducts.length) {
    return null
  }

  const averagePrice =
    displayedProducts.reduce(
      (sum, product) => sum + product.price,
      0
    ) / displayedProducts.length

  const averageRating =
    displayedProducts.reduce(
      (sum, product) => sum + (product.rating || 0),
      0
    ) / displayedProducts.length

  if (/cheaper|cheapest|less expensive|lower price/i.test(text)) {
    return previousResults
      .filter(product => product.price < averagePrice)
      .sort((a, b) => a.price - b.price)
  }

  if (/more expensive|costlier|higher price/i.test(text)) {
    return previousResults
      .filter(product => product.price > averagePrice)
      .sort((a, b) => b.price - a.price)
  }

  if (/better rated|higher rated|higher rating/i.test(text)) {
    return previousResults
      .filter(product => (product.rating || 0) > averageRating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  return null
}

// Converts requests such as "add the cheapest one to cart" into a product action.
const getShoppingAction = (message, previousResults, displayedProducts) => {
  const text = message.toLowerCase()
  const wantsCart = /\b(cart|basket)\b/.test(text) &&
    /\b(add|put|move|send)\b/.test(text)
  const wantsWishlist = /\b(wishlist|wish list|save)\b/.test(text) &&
    /\b(add|put|move|save)\b/.test(text)

  if (!wantsCart && !wantsWishlist) return null

  const candidates = previousResults.length
    ? previousResults
    : displayedProducts

  if (!candidates.length) {
    return { type: wantsCart ? 'cart' : 'wishlist', product: null }
  }

  let product = null
  const ordinalMatch = text.match(/\b(first|1st|second|2nd|third|3rd|fourth|4th)\b/)
  const ordinals = {
    first: 0, '1st': 0,
    second: 1, '2nd': 1,
    third: 2, '3rd': 2,
    fourth: 3, '4th': 3,
  }

  if (ordinalMatch) {
    product = displayedProducts[ordinals[ordinalMatch[0]]] || candidates[ordinals[ordinalMatch[0]]]
  } else if (/\b(cheapest|lowest price|least expensive)\b/.test(text)) {
    product = [...candidates].sort((a, b) => a.price - b.price)[0]
  } else if (/\b(most expensive|costliest|highest price)\b/.test(text)) {
    product = [...candidates].sort((a, b) => b.price - a.price)[0]
  } else if (/\b(highest rated|best rated|top rated)\b/.test(text)) {
    product = [...candidates].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
  } else {
    product = displayedProducts[0] || candidates[0]
  }

  return {
    type: wantsCart ? 'cart' : 'wishlist',
    product: product || null,
  }
}

function AssistantChat({ products = [] }) {
  const dispatch = useDispatch()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [loading, setLoading] = useState(false)

  const [lastResults, setLastResults] = useState([])
  const [lastDisplayedProducts, setLastDisplayedProducts] = useState([])

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, loading])

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE])
    setLastResults([])
    setLastDisplayedProducts([])
    setInput('')
    setLoading(false)
  }

  const handleSend = () => {
    const message = input.trim()

    if (!message || loading) return

    setMessages(prev => [
      ...prev,
      { role: 'user', text: message },
    ])

    setInput('')
    setLoading(true)

    setTimeout(() => {
      try {
        const action = getShoppingAction(
          message,
          lastResults,
          lastDisplayedProducts
        )

        if (action) {
          if (!action.product) {
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                text: 'Please search for some products first. Then I can add a selected result to your cart or wishlist.',
                products: [],
                success: false,
              },
            ])
          } else if (action.type === 'cart') {
            dispatch(addToCart(action.product))
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                text: `Done! "${action.product.title}" has been added to your cart. 🛒`,
                products: [action.product],
                success: true,
              },
            ])
          } else {
            dispatch(toggleWishlist(action.product))
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                text: `"${action.product.title}" has been sent to your wishlist. If it was already saved, it has been removed. ❤️`,
                products: [action.product],
                success: true,
              },
            ])
          }
          return
        }

        const followUpResults = handleFollowUpQuery(
          message,
          lastResults,
          lastDisplayedProducts
        )

        if (followUpResults !== null) {
          const displayed = followUpResults.slice(0, 6)

          setLastResults(followUpResults)
          setLastDisplayedProducts(displayed)

          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              text: displayed.length
                ? `Here are ${displayed.length} refined results based on your previous search.`
                : 'I could not find matching products in your previous results. Try another comparison.',
              products: displayed,
              success: displayed.length > 0,
            },
          ])

          return
        }

        const result = processShoppingQuery(products, message)
        const displayed = result.products.slice(0, 6)

        setLastResults(result.products)
        setLastDisplayedProducts(displayed)

        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: result.message,
            products: displayed,
            success: result.success,
          },
        ])
      } catch {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: 'Something went wrong. Please try again.',
            products: [],
            success: false,
          },
        ])
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  const handleSuggestion = suggestion => {
    setInput(suggestion)
  }

  const handleAddProductToCart = product => {
    dispatch(addToCart(product))
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        text: `"${product.title}" has been added to your cart. 🛒`,
        products: [],
        success: true,
      },
    ])
  }

  const handleAddProductToWishlist = product => {
    dispatch(toggleWishlist(product))
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        text: `"${product.title}" wishlist action completed. If it was already saved, it has been removed. ❤️`,
        products: [],
        success: true,
      },
    ])
  }

  return (
    <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="rounded-2xl bg-indigo-600 p-3 text-white">
          <Bot size={25} />
        </div>

        <div className="flex-1">
          <h2 className="font-bold text-slate-900 dark:text-white">
            ShopSphere AI Assistant
          </h2>
          <p className="text-sm text-slate-500">
            Your personal shopping companion
          </p>
        </div>

        <button
          onClick={handleClearChat}
          disabled={messages.length === 1 && !input && !lastResults.length}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300"
        >
          <Trash2 size={15} />
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex min-h-[420px] max-h-[600px] flex-col gap-5 overflow-y-auto p-5">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                message.role === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {message.role === 'user'
                ? <User size={18} />
                : <Bot size={18} />}
            </div>

            <div
              className={`max-w-[85%] ${
                message.role === 'user' ? 'text-right' : ''
              }`}
            >
              <div
                className={`inline-block rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'rounded-tr-sm bg-indigo-600 text-white'
                    : 'rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
                }`}
              >
                {message.text}
              </div>

              {message.products?.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
                  {message.products.map(product => (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-36 w-full bg-slate-50 object-contain p-3"
                        loading="lazy"
                      />

                      <div className="p-3">
                        <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
                          {product.title}
                        </h3>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-indigo-600">
                            ${product.price}
                          </span>
                          <span className="text-xs text-amber-500">
                            ★ {product.rating || 'N/A'}
                          </span>
                        </div>

                        <a
                          href={`/products/${product.id}`}
                          className="mt-3 block rounded-xl bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-indigo-600 dark:bg-indigo-600"
                        >
                          View Product
                        </a>

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleAddProductToCart(product)}
                            className="flex items-center justify-center gap-1 rounded-lg bg-indigo-600 px-2 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                          >
                            <ShoppingCart size={14} />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleAddProductToWishlist(product)}
                            className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 transition hover:border-pink-400 hover:text-pink-500 dark:border-slate-700 dark:text-slate-200"
                          >
                            <Heart size={14} />
                            Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Bot size={20} className="text-indigo-600" />
            Finding products for you...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="border-t border-slate-200 px-5 pt-4 dark:border-slate-800">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Sparkles size={14} />
          TRY ASKING
        </p>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map(suggestion => (
            <button
              key={suggestion}
              onClick={() => handleSuggestion(suggestion)}
              className="rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-600 transition hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-3 p-5">
        <input
          type="text"
          value={input}
          onChange={event => setInput(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') handleSend()
          }}
          placeholder="Ask me what you want to shop..."
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="rounded-2xl bg-indigo-600 px-5 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <Send size={19} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pb-4 text-xs text-slate-400">
        <ShoppingBag size={13} />
        Rule-based shopping assistant · Demo experience
      </div>
    </section>
  )
}

export default AssistantChat
