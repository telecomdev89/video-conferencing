using PaderConference.Core.Dto.UseCaseResponses;
using PaderConference.Core.Interfaces;

namespace PaderConference.Core.Dto.UseCaseRequests
{
    public class LoginRequest : IUseCaseRequest<LoginResponse>
    {
        public LoginRequest(string? userName, string? password, string? remoteIpAddress, bool isGuestAuth = false)
        {
            UserName = userName;
            Password = password;
            RemoteIpAddress = remoteIpAddress;
            IsGuestAuth = isGuestAuth;
        }

        public string? UserName { get; }
        public string? Password { get; }
        public string? RemoteIpAddress { get; }

        public bool IsGuestAuth { get; }
    }
}