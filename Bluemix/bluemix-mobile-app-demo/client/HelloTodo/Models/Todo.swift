//
//  Todo.swift
//  HelloTodo
//
//  Created by Naoki Tsutsui on 4/23/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Gloss

struct Todo: Decodable {
    
    let id: Int?
    let text: String?
    let isDone: Bool?
    
    // MARK: - Deserialization
    
    init?(json: JSON) {
        id = "id" <~~ json
        text = "text" <~~ json
        isDone = "isDone" <~~ json
    }
}
