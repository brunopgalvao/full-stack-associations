import React, { useState, useEffect, useRef } from 'react'
import './Products.css'

import Product from '../../components/Product/Product'
import Search from '../../components/Search/Search'
import { AZ, ZA, lowestFirst, highestFirst } from '../../utils/sort'
import Sort from '../../components/Sort/Sort'
import Layout from '../../components/shared/Layout/Layout'
import { getProducts } from '../../services/products'

const Products = () => {
  const [allProducts, setAllProducts] = useState([])
  const [queriedProducts, setQueriedProducts] = useState([])
  const [isChanged, setIsChanged] = useState(false)
  const sortType = useRef('name-ascending')

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts()
      setAllProducts(products)
      setQueriedProducts(products)
    }
    fetchProducts()
  }, [])

  const handleSort = (type) => {
    if (type !== '' && type !== undefined) {
      sortType.current = type
    }

    switch (sortType.current) {
      case 'name-ascending':
        setQueriedProducts([...AZ(queriedProducts)])
        break
      case 'name-descending':
        setQueriedProducts([...ZA(queriedProducts)])
        break
      case 'price-ascending':
        setQueriedProducts([...lowestFirst(queriedProducts)])
        break
      case 'price-descending':
        setQueriedProducts([...highestFirst(queriedProducts)])
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (isChanged) {
      handleSort()
      setIsChanged(false)
    }
  }, [queriedProducts])

  const handleSearch = (event) => {
    const newQueriedProducts = allProducts.filter((product) =>
      product.name.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setQueriedProducts(newQueriedProducts)
    setIsChanged(true)
  }

  const handleSubmit = (event) => event.preventDefault()

  return (
    <Layout>
      <Search onSubmit={handleSubmit} onChange={handleSearch} />
      <Sort onSubmit={handleSubmit} handleSort={handleSort} />
      <div className='products'>
        {queriedProducts.map((product, index) => {
          return (
            <Product
              _id={product._id}
              name={product.name}
              imgURL={product.imgURL}
              price={product.price}
              key={index}
            />
          )
        })}
      </div>
    </Layout>
  )
}

export default Products
