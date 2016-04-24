//
//  Todo.swift
//  HelloTodo
//
//  Created by Naoki Tsutsui on 4/23/16.
//  Copyright © 2016 Naoki Tsutsui. All rights reserved.
//

import Gloss

struct Todo {
    
    let id: Int?
    let text: String?
    let isDone: Bool?
    
}

extension Todo: Glossy {
    // MARK: - Deserialization
    
    init(id: Int, text:String, isDone:Bool) {
        self.id = id
        self.text = text
        self.isDone = isDone
    }
    
    init?(json: JSON) {
        id = "id" <~~ json
        text = "text" <~~ json
        isDone = "isDone" <~~ json
    }
    
    func toJSON() -> JSON? {
        return jsonify([
            "id" ~~> id,
            "text" ~~> text,
            "isDone" ~~> isDone
            ])
    }    
}