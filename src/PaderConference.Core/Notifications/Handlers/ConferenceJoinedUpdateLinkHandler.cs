﻿using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using PaderConference.Core.Domain.Entities;
using PaderConference.Core.Interfaces.Gateways.Repositories;
using PaderConference.Core.Specifications;
using SpeciVacation;

namespace PaderConference.Core.Notifications.Handlers
{
    public class ConferenceJoinedUpdateLinkHandler : INotificationHandler<ConferenceJoinedNotification>
    {
        private readonly IConferenceLinkRepo _conferenceLinkRepo;
        private readonly IConferenceRepo _conferenceRepo;

        public ConferenceJoinedUpdateLinkHandler(IConferenceLinkRepo conferenceLinkRepo, IConferenceRepo conferenceRepo)
        {
            _conferenceLinkRepo = conferenceLinkRepo;
            _conferenceRepo = conferenceRepo;
        }

        public async Task Handle(ConferenceJoinedNotification notification, CancellationToken cancellationToken)
        {
            var link = (await _conferenceLinkRepo.FindAsync(
                new ConferenceLinkByConference(notification.ConferenceId).And(
                    new ConferenceLinkByParticipant(notification.ParticipantId)))).FirstOrDefault();

            if (link == null)
            {
                var conference = await _conferenceRepo.FindById(notification.ConferenceId);
                if (conference == null) return;

                cancellationToken.ThrowIfCancellationRequested();

                link = new ConferenceLink(notification.ParticipantId, notification.ConferenceId);
                link.UpdateFromConference(conference);
            }

            link.OnJoined();
            await _conferenceLinkRepo.CreateOrReplaceAsync(link);
        }
    }
}
