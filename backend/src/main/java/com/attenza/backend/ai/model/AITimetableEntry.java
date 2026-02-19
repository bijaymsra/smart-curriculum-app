package com.attenza.backend.ai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class AITimetableEntry {

    private Long entryId;

    private Long facultyId;
    private Long studentGroupId;
    private Long roomId;

    private AISlot slot;
}
