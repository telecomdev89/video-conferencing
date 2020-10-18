﻿using PaderConference.Core.Dto;

namespace PaderConference.Infrastructure.Services.Chat
{
    public class ChatError
    {
        public static Error EmptyMessageNotAllowed =>
            new ServiceError("An empty message is not allowed.", ServiceErrorCode.Chat_EmptyMessage);

        public static Error PermissionToSendMessageDenied =>
            new ServiceError("Permissions to send a chat message denied.",
                ServiceErrorCode.Chat_PermissionDenied_SendMessage);

        public static Error PermissionToSendAnonymousMessageDenied =>
            new ServiceError("Permissions to send this message as anonymous denied.",
                ServiceErrorCode.Chat_PermissionDenied_SendAnonymousMessage);

        public static Error PermissionToSendPrivateMessageDenied =>
            new ServiceError("Permissions to send private messages denied.",
                ServiceErrorCode.Chat_PermissionDenied_SendPrivateMessage);

        public static Error InvalidFilter =>
            new ServiceError("Invalid chat message filter.", ServiceErrorCode.Chat_InvalidFilter);
    }
}