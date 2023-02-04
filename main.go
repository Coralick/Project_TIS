package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var router *gin.Engine
var clientList map[string]*Player

type Point struct {
	x float64
	y float64
}
type Player struct {
	Conn   *websocket.Conn `json:"-"`
	Name string `json:"name"`
	Coords Point `json:"coords"`
	Radius float64 `json:"radius"`
	Color  string `json:"color"`
}
func main() {
	clientList = make(map[*websocket.Conn]*Player)
	router := gin.Default()
	router.LoadHTMLGlob("html/*.html")
	router.Static("assets", "assets")
	router.GET("/", func(context *gin.Context) {
		context.HTML(200, "index.html", nil)
	})
	router.GET("/enter", func(context *gin.Context) {
		context.HTML(200, "input.html", nil)
	})

	upgrader := websocket.Upgrader{}
	router.GET("/chat/:name", func(context *gin.Context) {
		connection, e := upgrader.Upgrade(context.Writer, context.Request, nil)
		if e != nil {
			return
		}
		name := context.Param("name")
		player := clientList[name]
		//clientList[connection] = ""

		clientList[name] = &Player{
			Conn:   connection,
			Coords: Point{},
			Color:  "#FF0000",
			Radius: 1,
		}
		go MovePlayer(player)
		//go ChatHandler(connection)
		//_, data, e := connection.ReadMessage()
		//fmt.Println(data)
		//connection.WriteMessage(websocket.TextMessage, []byte("GTA"))

	})
	go Game()
	_ = router.Run("127.0.0.1:8080")
}

func Game() {
	for {
		for name, player := range clientList {
			player.Conn.WriteMessage()
		}
	}
}
func MovePlayer(player *Player) {
	defer func() {
		e := recover()
		if e != nil {
			fmt.Println(e)
		}
		delete(clientList,  player )
	}()
}
	//func ChayHandler(conn *websocket.Conn) {
	//	defer func() {
	//		e := recover()
	//		if e != nil {
	//			fmt.Println(e)
	//		}
	//		delete(clientList, conn)
	//	}()
	//
	//	for {
	//		_, data, e := conn.ReadMessage()
	//		if e != nil {
	//			continue
	//		}
	//
	//		for client := range clientList {
	//			if conn != client {
	//				_ = client.WriteMessage(websocket.TextMessage, data)
	//			}
	//		}
	//	}

