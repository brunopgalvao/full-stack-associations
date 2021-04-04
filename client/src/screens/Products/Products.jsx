import React, { useState, useEffect } from 'react'
import './Products.css'

import Product from '../../components/Product/Product'
import Search from '../../components/Search/Search'
import { AZ, ZA, lowestFirst, highestFirst } from "../../utils/sort"
import Sort from '../../components/Sort/Sort'
import Layout from '../../components/shared/Layout/Layout'
import { getProducts } from '../../services/products'

const Products = () => {
  const [allProducts, setAllProducts] = useState([])
  const [queriedProducts, setQueriedProducts] = useState([])
  const [sortType, setSortType] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts()
      setAllProducts(products)
      setQueriedProducts(products)
    }
    fetchProducts()
  }, [])

  const handleSort = type => {
    console.log("Sort called.")
    setSortType(type)
    switch (type) {
      case "name-ascending":
        setQueriedProducts(AZ(queriedProducts))
        break
      case "name-descending":
        setQueriedProducts(ZA(queriedProducts))
        break
      case "price-ascending":
        setQueriedProducts(lowestFirst(queriedProducts))
        break
      case "price-descending":
        setQueriedProducts(highestFirst(queriedProducts))
        break
      default:
        break
    }
  }

  useEffect(() => {
    const sort = () => handleSort(sortType)
    sort()
  }, [queriedProducts])

  const handleSearch = event => {
    const newQueriedProducts = allProducts.filter(product => product.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setQueriedProducts(newQueriedProducts)
  }

  const handleSubmit = event => event.preventDefault()

  return (
    <Layout>
      <Search onSubmit={handleSubmit} onChange={handleSearch} />
      <Sort onSubmit={handleSubmit} onChange={handleSort} />
      <div className='products'>
        {queriedProducts.map((product, index) => {
          console.log('Rendering product.' + product.price)
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