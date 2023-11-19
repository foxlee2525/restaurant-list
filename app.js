// app.js
const express = require('express')
const app = express()
const port = 3000

// 引入餐廳資料(串接API)
const restaurantList = require('./restaurant.json')

// 引入 express-handlebars 模塊
const exphbs = require('express-handlebars')

// 設定 Handlebars 模版引擎
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', '.hbs')

// 設定 static files(靜態檔案)
app.use(express.static('public'))

// index 路由設定
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

// show 路由設定
app.get('/restaurants/:restaurant_id', (req, res) => {
  // console.log(req.params.restaurant_id)
  const restaurant = restaurantList.results.find((restaurant) =>
    restaurant.id.toString() === req.params.restaurant_id
  )
  res.render('show', { restaurant: restaurant })
})

// search bar 路由設定
app.get('/search', (req, res) => {
  // console.log(req.query.keyword)
  const keyword = req.query.keyword.trim()

  // 確保使用者有確切輸入關鍵字
  if (!keyword) {
    return res.redirect('/')
  }

  const restaurants = restaurantList.results.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
  )

  if (restaurants.length === 0) {
    res.render('noresult', { keyword: keyword })
  } else {
    res.render('index', { restaurants: restaurants, keyword: keyword })
  }
})


// 監聽 express 伺服器
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})