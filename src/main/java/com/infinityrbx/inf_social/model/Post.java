package com.infinityrbx.inf_social.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Post {
@Id
    private Long id;
    private Long userId;
    private String description;
    //Like
    //Comment
}

