<?php

namespace App\Controller;

use App\Mercure\JwtProvider;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\Uuid;

class DefaultController extends AbstractController
{

    private $security;
    private $jwtProvider;

    public function __construct(Security $security, JwtProvider $jwtProvider)
    {
        $this->security = $security;
        $this->jwtProvider = $jwtProvider;
    }


    #[Route('/visio', name: 'visio', methods: ['POST'])]
    public function hub(MessageBusInterface $bus, SerializerInterface $serializerInterface)
    {
        $uuid = Uuid::v4();
        $data =
            [
                'username' => $this->security->getUser()->getUsername(),
                'id' => json_decode($serializerInterface->serialize($this->getUser(), 'json', ['groups' => 'read_id']))->id,
                'online' => true,
                'peerId' => $_POST['data'],
                'type' => $_POST['type'],
                'me' => false,
                'inRoom' => $_POST['inRoom'] === "true" ? true : false
            ];
        $update = new Update($_POST['topic'], json_encode($data), true, $uuid);
        $bus->dispatch($update);
        return new Response();
    }

    #[Route('/', name: 'index')]
    public function test(SerializerInterface $serializerInterface): Response
    {
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        } else {
            $data =
                [
                    'username' => $this->security->getUser()->getUsername(),
                    'id' => json_decode($serializerInterface->serialize($this->getUser(), 'json', ['groups' => 'read_id']))->id,
                    'online' => true
                ];
            return $this->render('index.html.twig', ['user' => json_encode($data)]);
        }
    }

    #[Route('/get_authentication', name: 'token')]
    public function token(SerializerInterface $serializerInterface): Response
    {

        $data = [
            'tokenSub' => $this->jwtProvider->subscribeUser($this->getUser()),
            'id' => json_decode($serializerInterface->serialize($this->getUser(), 'json', ['groups' => 'read_id']))->id,
            'token' => $this->jwtProvider->publisherToken()
        ];

        return new Response(json_encode($data));
    }


    #[Route('/disconnect', name: 'disconnect', methods: ['POST'])]
    public function disconnect(MessageBusInterface $bus, SerializerInterface $serializerInterface)
    {
        $uuid = Uuid::v4();
        $data =
            [
                'username' => $this->security->getUser()->getUsername(),
                'id' => json_decode($serializerInterface->serialize($this->getUser(), 'json', ['groups' => 'read_id']))->id,
                'online' => false,
                'peerId' => null,
                'inRoom' => false,
                'me' => false,
                'type' => 'disconnect'
            ];

        if ($this->security->getUser()) {
            $update = new Update($_POST['topic'], json_encode($data), false, $uuid);
            $bus->dispatch($update);
            return new Response();
        } else {
            return $this->redirectToRoute('conf');
        }
    }

    #[Route('/chat', name: 'chat', methods: ['POST'])]
    public function chat(MessageBusInterface $messageBus): Response
    {
        $uuid = Uuid::v4();
        $update = new Update($_POST['topic'], $_POST['data'], true, $uuid);
        $messageBus->dispatch($update);
        return new Response();
    }
}
