'use strict';

const assert = require('assert');
const Database = require('../../../src/database');
const SkillRepository = require('../../../src/skill/skill-repository');
const UserRepository = require('../../../src/user/user-repository');
const _ = require('lodash');

describe('User Repository', () => {
    beforeEach(() => Database.clear());

    it('should add new user and get it', (done) => {
        const email = 'email';
        const name = 'name';
        const password = 'password';
        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.getUsers())
            .then((users) => {
                const expected = _.filter(users, (user) => user.name === name && user.email === email);
                assert.equal(expected.length, 1);
            })
            .then(done)
            .catch(done);
    });

    it('should add new user and find it by email and by id', (done) => {
        const email = 'email';
        const name = 'name';
        const password = 'password';
        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmail(email))
            .then((user) => UserRepository.findUserById(user.id))
            .then((user) => {
                assert.equal(user.name, name);
                assert.equal(user.email, email);
            })
            .then(done)
            .catch(done);
    });

    it('should create a new user, a new skill and assign it and get updates', (done) => {
        const email = 'email';
        const name = 'name';
        const password = 'password';
        const skillName = 'skill';

        let user, skill;

        SkillRepository
            .addNewSkill(skillName)
            .then(() => SkillRepository.findSkillByName(skillName))
            .then((_skill) => {
                skill = _skill;
            })
            .then(() => UserRepository.addNewUser({email, name, password}))
            .then(() => UserRepository.findUserByEmail(email))
            .then((_user) => {
                user = _user;
            })
            .then(() => SkillRepository.addSkill({interested: true, level: 2, id: skill.id, user_id: user.id}))
            .then(() => UserRepository.getUpdates())
            .then((updates) => {
                assert.deepEqual(_.pick(updates[0], ['skill_level', 'skill_name', 'user_email', 'user_name']),
                    {
                        "skill_level": 2,
                        "skill_name": "skill",
                        "user_email": "email",
                        "user_name": "name"
                    }
                );
            })
            .then(done)
            .catch(done);
    });

    it('should create a new user, a new skill and assign it and get user by skill', (done) => {
        const email = 'email';
        const name = 'name';
        const password = 'password';
        const skillName = 'skill';

        let user, skill;

        SkillRepository
            .addNewSkill(skillName)
            .then(() => SkillRepository.findSkillByName(skillName))
            .then((_skill) => {
                skill = _skill;
            })
            .then(() => UserRepository.addNewUser({email, name, password}))
            .then(() => UserRepository.findUserByEmail(email))
            .then((_user) => {
                user = _user;
            })
            .then(() => SkillRepository.addSkill({interested: true, level: 2, id: skill.id, user_id: user.id}))
            .then(() => SkillRepository.findSkillByName(skillName))
            .then((skill) => UserRepository.findUsersBySkill(skill.id))
            .then((users) => {
                assert.deepEqual(_.pick(users[0], ['name', 'email']),
                    {
                        email: "email",
                        name: "name"
                    }
                );
            })
            .then(done)
            .catch(done);
    });

    it('should delete user', (done) => {
        const email = 'email';
        const name = 'name';
        const password = 'password';
        const skillName1 = 'skill1';

        let user;

        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmail(email))
            .then((_user) => user = _user)
            .then(() => SkillRepository.addNewSkill(skillName1))
            .then(() => SkillRepository.findSkillByName(skillName1))
            .then((skill) => SkillRepository.addSkill({id: skill.id, interested: true, level: 2, user_id: user.id}))
            .then(() => SkillRepository.findUserSkillsById(user.id))
            .then((userSkills) => {
                assert.deepEqual(userSkills.map((userSkill) => userSkill.skill_name), ["skill1"]);
            })
            .then(() => UserRepository.deleteUserById(user.id))
            .then(() => UserRepository.findUserByEmail(email))
            .then((user) => {
                assert.equal(user, undefined);
            })
            .then(done)
            .catch(done);
    });

    it('should update user', (done) => {
        const email = 'email';
        const name = 'name';
        const password = 'password';
        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmail(email))
            .then((user) => UserRepository.updateUser(user.id, {diploma: '2015-01-01'}))
            .then(() => UserRepository.findUserByEmail(email))
            .then((user) => {
                assert.ok(user.diploma);
            })
            .then(done)
            .catch(done);
    });

    it('should return managers', (done) => {
        const email = 'email';
        const name = 'name';
        const password = 'password';
        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmail(email))
            .then((user) => UserRepository.addRole(user, 'Manager'))
            .then(() => UserRepository.getUsersWithRoles('Manager'))
            .then((users) => {
                assert.equal(users[0].email, email);
            })
            .then(done)
            .catch(done);
    });

    it('should return users with roles (Web)', (done) => {
        const email = 'email';
        const name = 'name';
        const password = 'password';
        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmail(email))
            .then((user) => UserRepository.addRole(user, 'Manager'))
            .then(() => UserRepository.getWebUsersWithRoles('Manager'))
            .then((users) => {
                assert.equal(users[0].email, email);
            })
            .then(done)
            .catch(done);
    });

    it('should return user by readable id', (done) => {
        const email = 'email';
        const name = 'Firstname Lastname';
        const password = 'password';
        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByReadableId('firstname-lastname'))
            .then((user) => {
                assert.equal(user.name, 'Firstname Lastname');
            })
            .then(done)
            .catch(done);
    });

    it('should return management', (done) => {
        const email = 'jsmadja@xebia.fr';
        const name = 'Julien Smadja';
        const password = 'password';

        let manager, managedUser;

        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmail(email))
            .then(user => UserRepository.addRole(user, 'Manager'))
            .then(() => UserRepository.getUsersWithRoles('Manager'))
            .then(users => manager = users[0])
            .then(() => UserRepository.addNewUser({email: 'blacroix@xebia.fr', name: 'Benjamin Lacroix', password: 'password'}))
            .then(() => UserRepository.findUserByEmail('blacroix@xebia.fr'))
            .then((user) => {
                managedUser = user;
                return UserRepository.assignManager(user.id, manager.id);
            })
            .then(() => UserRepository.getManagement())
            .then((management) => {
                assert.deepEqual(management,
                    [
                        {
                            manager_id: manager.id,
                            manager_name: manager.name,
                            user_id: managedUser.id,
                            user_name: managedUser.name
                        },
                        {
                            manager_id: null,
                            manager_name: null,
                            user_id: manager.id,
                            user_name: manager.name
                        }
                    ]);
            })
            .then(done)
            .catch(done);
    });

    it('should find user by email and password', (done) => {
        const email = 'jsmadja@xebia.fr';
        const name = 'Julien Smadja';
        const password = 'password';

        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmailAndPassword(email, password))
            .then(user => {
                delete user.id;
                assert.deepEqual(user,
                    {
                        address: null,
                        diploma: null,
                        email: 'jsmadja@xebia.fr',
                        manager_id: null,
                        name: 'Julien Smadja',
                        phone: null
                    }
                );
            })
            .then(done)
            .catch(done);
    });

    it('should find user by id and password', (done) => {
        const email = 'jsmadja@xebia.fr';
        const name = 'Julien Smadja';
        const password = 'password';

        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmailAndPassword(email, password))
            .then((user) => UserRepository.findUserByIdAndPassword(user.id, password))
            .then(user => {
                delete user.id;
                assert.deepEqual(user,
                    {
                        address: null,
                        diploma: null,
                        email: 'jsmadja@xebia.fr',
                        manager_id: null,
                        name: 'Julien Smadja',
                        phone: null
                    }
                );
            })
            .then(done)
            .catch(done);
    });

    it('should find update password', (done) => {
        const email = 'jsmadja@xebia.fr';
        const name = 'Julien Smadja';
        const password = 'password';

        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmailAndPassword(email, password))
            .then((user) => UserRepository.updatePassword(user.id, password, 'newpassword'))
            .then(() => UserRepository.findUserByEmailAndPassword(email, 'newpassword'))
            .then(user => {
                delete user.id;
                assert.deepEqual(user,
                    {
                        address: null,
                        diploma: null,
                        email: 'jsmadja@xebia.fr',
                        manager_id: null,
                        name: 'Julien Smadja',
                        phone: null
                    }
                );
            })
            .then(done)
            .catch(done);
    });

    it('should find update phone', (done) => {
        const email = 'jsmadja@xebia.fr';
        const name = 'Julien Smadja';
        const password = 'password';

        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmail(email, password))
            .then((user) => UserRepository.updatePhone(user.id, '01.23.45.67.89'))
            .then(() => UserRepository.findUserByEmailAndPassword(email, password))
            .then(user => {
                delete user.id;
                assert.deepEqual(user,
                    {
                        address: null,
                        diploma: null,
                        email: 'jsmadja@xebia.fr',
                        manager_id: null,
                        name: 'Julien Smadja',
                        phone: '01.23.45.67.89'
                    }
                );
            })
            .then(done)
            .catch(done);
    });

    it('should find update address', (done) => {
        const email = 'jsmadja@xebia.fr';
        const name = 'Julien Smadja';
        const password = 'password';

        UserRepository
            .addNewUser({email, name, password})
            .then(() => UserRepository.findUserByEmail(email, password))
            .then((user) => UserRepository.updateAddress(user.id, '1 rue du yaourt'))
            .then(() => UserRepository.findUserByEmailAndPassword(email, password))
            .then(user => {
                delete user.id;
                assert.deepEqual(user,
                    {
                        address: '"1 rue du yaourt"',
                        diploma: null,
                        email: 'jsmadja@xebia.fr',
                        manager_id: null,
                        name: 'Julien Smadja',
                        phone: null
                    }
                );
            })
            .then(done)
            .catch(done);
    });
});
