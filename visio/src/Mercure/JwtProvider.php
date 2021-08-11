<?php

namespace App\Mercure;

use App\Entity\User;
use Symfony\Component\Security\Core\Security;
use Lcobucci\JWT\ClaimsFormatter;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Encoder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Token\Builder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;

final class JwtProvider
{

    /** 
     * @var string
     */
    private $secret;

    private $security;



    public function __construct(string $secret, Security $security)
    {
        $this->secret = $secret;
        $this->security = $security;
    }


    public function __invoke(): string
    {
        if ($this->security->getUser()) {
            $key = InMemory::plainText($this->secret);
            $configuration = Configuration::forSymmetricSigner(new Sha256(), $key);
            $token = $configuration->builder()
                ->withClaim('mercure', ['publish' => ['*']])
                ->getToken($configuration->signer(), $configuration->signingKey())
                ->toString();
            return $token;
        }
    }

    public function publisher(): Cookie
    {

        if ($this->security->getUser()) {
            $key = InMemory::plainText($this->secret);
            $configuration = Configuration::forSymmetricSigner(new Sha256(), $key);
            $token = $configuration->builder()
                ->withClaim('mercure', ['subscribe' => ["*"]])
                ->getToken($configuration->signer(), $configuration->signingKey())
                ->toString();
            $cookie = Cookie::create('mercureAuthorization')
                ->withValue($token)
                ->withPath('/.well-known/mercure')
                ->withSecure(true)
                ->withHttpOnly(true)
                ->withSameSite('Lax');


            return $cookie;
        }
    }

    public function subscribeUser(User $user): string
    {
        if ($this->security->getUser()) {
            $key = InMemory::plainText($this->secret);
            $configuration = Configuration::forSymmetricSigner(new Sha256(), $key);
            $token = $configuration->builder()
                ->withClaim('mercure', ['subscribe' => [
                    "https://aaa/user/{$user->getId()}",
                    "https://aaa/join",
                    "https://aaa/chat",
                    'https://aaa/user',
                    'https://aaa/disconnected'
                ]])
                ->getToken($configuration->signer(), $configuration->signingKey())
                ->toString();
            return $token;
        }
    }


    public function publisherToken(): string
    {

        if ($this->security->getUser()) {
            $key = InMemory::plainText($this->secret);
            $configuration = Configuration::forSymmetricSigner(new Sha256(), $key);
            $token = $configuration->builder()
                ->withClaim('mercure', ['subscribe' => ["*"], 'publish' => ['*']])
                ->getToken($configuration->signer(), $configuration->signingKey())
                ->toString();
            return $token;
        }
    }
}
