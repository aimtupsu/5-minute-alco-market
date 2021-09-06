package com.aimtupsu.controller;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("test/")
public class SomeController {

    private static final Map<Integer, SomeInfo> SOME_INFO_MAP;

    static {
        SOME_INFO_MAP = List.of(
                new SomeInfo(1, "Some Info 1", "Some Info 1 Description"),
                new SomeInfo(2, "Some Info 2", "Some Info 2 Description"),
                new SomeInfo(3, "Some Info 3", "Some Info 3 Description")
        ).stream().collect(Collectors.toMap(SomeInfo::getId, someInfo -> someInfo));
    }

    @GetMapping("some-infos/")
    public Collection<SomeInfo> getSomeInfos() {
        return SOME_INFO_MAP.values();
    }

    @GetMapping("some-infos/{id}")
    public SomeInfo getSomeInfo(@PathVariable final int id) {
        return SOME_INFO_MAP.get(id);
    }

    @Getter
    @RequiredArgsConstructor
    @ToString
    @EqualsAndHashCode
    private static class SomeInfo {

        private final int id;
        private final String info;
        private final String description;
    }

}
