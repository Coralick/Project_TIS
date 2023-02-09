package main

import "github.com/gorilla/websocket"

type Point struct {
	x float64
	y float64
}
type Transfer struct {
	Type int    `json:"type"`
	Data string `json:"data"`
}
type Player struct {
	Conn   *websocket.Conn `json:"-"`
	Name   string          `json:"name"`
	Coords Point           `json:"coords"`
	Radius float64         `json:"radius"`
	Color  string          `json:"color"`
}
type playerList struct {
	Type    int       `json:"type"`
	Players []*Player `json:"player"`
}
