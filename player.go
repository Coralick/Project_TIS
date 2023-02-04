package main

import "github.com/gorilla/websocket"

func main() {

}

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
