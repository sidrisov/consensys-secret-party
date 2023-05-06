import { ethers } from 'hardhat';

async function main() {
  const SecretPartyList = await ethers.getContractFactory('SecretPartyList');

  const secretPartyList = await SecretPartyList.deploy();

  await secretPartyList.deployed();

  console.log('SecretPartyList deployed to:', secretPartyList.address);

  const signer = ethers.provider.getSigner(0);

  // populate list
  await secretPartyList.invite(INVITATIONS);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const INVITATIONS = [
  'Sidney Kertzmann',
  'Miss Margarita Lowe Sr.',
  'Dr. Olga Kassulke',
  'Chris Windler',
  'Robin Hessel Jr.',
  'Alexander Franey',
  'Traci McDermott',
  'Anna Stehr',
  'Norman Block',
  'Mr. Janice Ryan',
  'Shelly Toy',
  'Paula Pagac DVM',
  'Mrs. Shelia Welch',
  'Mr. Otis Koelpin III',
  'Katrina Hansen',
  'Ms. Nina Gulgowski',
  'Rosie Bartell',
  'Merle Fisher',
  'Brandi Johnston',
  'Mrs. Priscilla Parker',
  'Jeremy Hansen III',
  'Mae Hyatt',
  'Beth Stracke',
  'Ms. Angel Morissette',
  'Lynette Considine',
  'Spencer Bauch DDS',
  'Dr. Raymond Heaney',
  'Willard Considine',
  'Cathy Swift',
  'Mr. Jennifer Bednar',
  'Oscar Hammes',
  'Maryann Collins',
  'Iris Kunze DVM',
  'Dr. Miranda Borer',
  'Larry Parisian',
  'Jean Crona',
  'Gerald McGlynn',
  'Eula Dietrich',
  'Kristie Zieme',
  'Dave Medhurst',
  'Sergio Nicolas',
  'Kirk Kulas',
  'Erick Glover',
  'Levi Ritchie II',
  'Toni Hahn',
  'Joanne Lockman',
  'Jason Murphy',
  'Kristina Hodkiewicz',
  'Homer Nitzsche',
  'Susie Klocko',
  'Wanda Ratke',
  'Sheila Braun',
  'Ms. Rochelle Fahey',
  'Mr. Darrin Carroll',
  'Heather Cronin',
  'Doreen Smith',
  'May Aufderhar',
  'Laura Wolff III',
  'Ruben Toy',
  'Ms. Elisa Oberbrunner',
  'Julius Rath DDS',
  'Yolanda Nitzsche',
  'Angel Marvin',
  'Mr. Colin Rowe',
  'Frankie Wisozk I',
  'Brad Reinger',
  'Ms. Kristi Friesen',
  'Miss Carla Jones',
  'Jasmine Wisozk',
  'Caroline Von',
  'Catherine Schimmel',
  'Jenna Barton',
  'Roy Blick',
  'Ian Witting',
  'Horace Larkin DVM',
  'Henry Kerluke',
  'Blanche Runolfsdottir DDS',
  'Martin Bergnaum',
  'Miss Michael Prosacco III',
  'Monique Boyer',
  'Dr. Kristie Fisher',
  'Bryant Thompson',
  'Karla Stracke',
  'Tricia Walker',
  'Judith Walsh III',
  'Tyrone Kiehn',
  'Irving Greenholt',
  'Arturo Schowalter',
  'Ms. Alonzo Nienow',
  'Sonja Runolfsdottir',
  'Darin Fisher MD',
  'Tabitha Hirthe',
  'Jeanne Von',
  'Dr. Scott Fritsch',
  'Gloria Fadel',
  'Cody Bechtelar',
  'Mr. Rodolfo Stark',
  'Sheila Bartell DDS',
  'Fred Leannon',
  'Blanca Gutkowski',
];
