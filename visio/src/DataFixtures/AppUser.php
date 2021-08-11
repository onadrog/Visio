<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppUser extends Fixture
{
    public function load(ObjectManager $manager)
    {

        $user = new User();
        $user->setUsername('user1');
        $user->setPassword('$2y$12$PQrVFWQCMxXWyFhTLU9xxeahy2rDF8lcmKGBtiLo2jrGcRYlLeG8G');
        $user->setRoles(['ROLE_USER']);
        $manager->persist($user);

        $user2 = new User();
        $user2->setUsername('user2');
        $user2->setPassword('$2y$12$PQrVFWQCMxXWyFhTLU9xxeahy2rDF8lcmKGBtiLo2jrGcRYlLeG8G');
        $user2->setRoles(['ROLE_USER']);
        $manager->persist($user2);

        $user3 = new User();
        $user3->setUsername('user3');
        $user3->setPassword('$2y$12$PQrVFWQCMxXWyFhTLU9xxeahy2rDF8lcmKGBtiLo2jrGcRYlLeG8G');
        $user3->setRoles(['ROLE_USER']);
        $manager->persist($user3);

        $manager->flush();
    }
}
