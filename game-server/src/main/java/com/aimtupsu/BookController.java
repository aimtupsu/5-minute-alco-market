package com.aimtupsu;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class BookController {

    List<Book> bookList;

    @Operation(summary = "This is to fetch All the Books stored in Db")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
            description = "Fetched All the Books form Db",
            content = {@Content(mediaType = "application/json")}),
            @ApiResponse(responseCode = "404",
            description = "NOt Available",
            content = @Content)
    })
    @GetMapping("book/")
    public List<Book> allBooks() {
        return bookList;
    }

    @PostMapping("book/")
    @ResponseStatus(HttpStatus.CREATED)
    public Book create(@RequestBody Book book)
    {
        bookList.add(book);
        return bookList.stream().filter(book::equals).findFirst().orElseThrow(BookNotFoundException::new);
    }

    @DeleteMapping("book/{id}")
    public void delete(@PathVariable long id)
    {
        final Book book = findById(id);
        bookList.remove(book);
    }

    @PutMapping("book/{id}")
    public Book updateBook(@RequestBody Book book, @PathVariable Long id) {
        if (book.getId() != id) {
            throw new BookIdMismatchException();
        }
        final Book oldBook = findById(id);
        bookList.remove(oldBook);
        bookList.add(book);
        return findById(id);
    }

    @GetMapping("book/{id}")
    public Book find(@PathVariable Long id) {
        return findById(id);
    }

    private Book findById(long id) {
        return bookList
                .stream()
                .filter(b -> b.getId() == id)
                .findFirst()
                .orElseThrow(BookNotFoundException::new);
    }


}
