package com.example.dorustreesportsacademy.controller;

import com.example.dorustreesportsacademy.entity.SportEntity;
import com.example.dorustreesportsacademy.service.SportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sports")
@CrossOrigin(origins = "http://localhost:5173")
public class SportController {

    private final SportService sportService;

    public SportController(SportService sportService) {
        this.sportService = sportService;
    }

    // Get all sports
    @GetMapping
    public ResponseEntity<List<SportEntity>> getAllSports() {
        return ResponseEntity.ok(sportService.getAllSports());
    }


    @PostMapping
    public ResponseEntity<SportEntity> addSport(@RequestBody SportEntity sport) {
        SportEntity saved = sportService.addSport(sport);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSport(@PathVariable Long id) {
        try {
            sportService.deleteSport(id);
            return ResponseEntity.ok("Sport deleted successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}
