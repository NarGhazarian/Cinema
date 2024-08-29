package com.kinomatron.cinema.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PlayerController {



    @GetMapping("/player/{movieId}")
    public String playMovie(@PathVariable("movieId") String movieId, Model model) {
        model.addAttribute("movieId", movieId);
        return "player";
    }
}
