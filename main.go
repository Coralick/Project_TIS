package main

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"time"
)

var router *gin.Engine
var players map[string]*Player
var moveEvent chan int

func main() {

	players = make(map[string]*Player)
	moveEvent = make(chan int)
	router := gin.Default()
	router.LoadHTMLGlob("html/*.html")
	router.Static("assets", "assets")

	router.GET("/", func(context *gin.Context) {
		context.HTML(200, "input.html", nil)
	})

	upgrader := websocket.Upgrader{}
	router.GET("/game!/:name", func(context *gin.Context) {
		name := context.Param("name")
		context.HTML(200, "index.html", name)
	})
	router.GET("/game/:name", func(context *gin.Context) {
		connection, e := upgrader.Upgrade(context.Writer, context.Request, nil)
		if e != nil {
			fmt.Println(e)
			return
		}
		name := context.Param("name")
		fmt.Println(name)

		fmt.Println("name")

		player := players[name]
		if player != nil {
			context.JSON(400, " Такое имя уже существует")
			return
		}

		//clientList[connection] = ""

		players[name] = &Player{
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
		for _, player := range players {
			fmt.Println(player)
			//player.Conn.WriteMessage()
		}
	}
}
func UpdateGame() {
	for {
		playerList := make([]*Player, 0)
		for _, player := range players {
			playerList = append(playerList, player)
		}
		transferData, e := json.Marshal(playerList)
		if e != nil {
			continue
		}
		data, _ := json.Marshal(Transfer{
			Type: 3,
			Data: string(transferData),
		})
		for _, player := range players {
			if player.Conn == nil {
				continue
			}
			_ = player.Conn.WriteMessage(websocket.TextMessage, data)
		}
		time.Sleep(time.Millisecond * 25)
	}
}

func MovePlayer(player *Player) {
	defer func() {
		e := recover()
		if e != nil {
			fmt.Println(e)
		}
		delete(players, player.Name)

	}()
	var d = "Печеньки"
	for {
		_, data, e := player.Conn.ReadMessage()
		if e != nil {
			continue
		}
		transfer := &Transfer{}
		e = json.Unmarshal(data, transfer)
		if e != nil {
			continue
		}
		switch transfer.Type {
		case 1, 2:
			for _, p := range players {
				if player != p && p.Conn != nil {
					p.Conn.WriteMessage(websocket.TextMessage, data)
				}
			}
		case 3:
			direction := &Point{}
			e = json.Unmarshal([]byte(transfer.Data), d)
			if e != nil {
				continue
			}
			player.Coords.x += direction.x
			player.Coords.y += direction.y

		}
	}
}
