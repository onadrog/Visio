<?php

namespace App\Tests\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SecurityTest extends WebTestCase
{
    /** @test */
    public function postMercure()
    {
        $client = static::createClient();
        $userRepository = static::$container->get(UserRepository::class);

        // retrieve the test user
        $testUser = $userRepository->findOneByUsername('user');

        // simulate $testUser being logged in
        $client->loginUser($testUser);

        $content = ["data" => "user", "topic" => "https://aaa/visio"];
        // test e.g. the profile page
        $client->request('POST', '/visio', $content, [], ['CONTENT_TYPE' => 'application/x-www-form-urlencoded']);
        //$this->assertRequestAttributeValueSame('Authorization', 'Bearer');
        $this->assertResponseStatusCodeSame(200);
    }
}
