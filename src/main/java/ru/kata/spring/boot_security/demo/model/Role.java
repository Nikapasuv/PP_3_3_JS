package ru.kata.spring.boot_security.demo.model;


import javax.persistence.*;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import lombok.Data;

@Entity
@Table(name = "roles")
@Data
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "roles")
    private List<User> users;

    public Role() {
    }

    public Role(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name.replaceAll("ROLE_", "");
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Role role = (Role) o;

        return id == role.id && name.equals(role.name);
    }

    @Override
    public String getAuthority() {
        return name;
    }
}