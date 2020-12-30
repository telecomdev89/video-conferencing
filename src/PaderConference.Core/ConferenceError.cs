﻿using PaderConference.Core.Dto;
using PaderConference.Core.Errors;
using PaderConference.Core.Services;

namespace PaderConference.Core
{
    public class ConferenceError : ErrorsProvider<ServiceErrorCode>
    {
        public static Error ConferenceNotFound =>
            NotFound("The conference was not found.", ServiceErrorCode.Conference_NotFound);

        public static Error ConferenceNotOpen =>
            Conflict("The conference is not open.", ServiceErrorCode.Conference_NotOpen);

        public static Error ParticipantNotRegistered =>
            BadRequest("The participant was not registered with the current conference.",
                ServiceErrorCode.Conference_ParticipantNotRegistered);

        public static Error ParticipantConnectionNotFound =>
            Conflict("The connection of the participant was not found.",
                ServiceErrorCode.Conference_ParticipantConnectionNotFound);

        public static Error UnexpectedError(string message)
        {
            return BadRequest(message, ServiceErrorCode.Conference_UnexpectedError);
        }
    }
}
