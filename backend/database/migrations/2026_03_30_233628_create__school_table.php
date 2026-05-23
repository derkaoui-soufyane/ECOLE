<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // -------------------------
        // 1️⃣ filieres
        // -------------------------
        Schema::create('filieres', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('code');
            $table->timestamps();
        });

        // -------------------------
        // 2️⃣ sujjets
        // -------------------------
        Schema::create('sujjets', function (Blueprint $table) {
            $table->id();
            $table->string('matiere_nom');
            $table->timestamps();
        });

        // -------------------------
        // 3️⃣ sujjets_filieres
        // -------------------------
        Schema::create('sujjets_filieres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
            $table->foreignId('sujjets_id')->constrained('sujjets')->onDelete('cascade');
            $table->timestamps();
        });

        // -------------------------
        // 4️⃣ enseignements
        // -------------------------
        Schema::create('enseignements', function (Blueprint $table) {
    $table->id();
    $table->string('nom_e');
    $table->string('prenom_e');
    $table->string('num_carte_national');
    $table->string('telephone_e');
    $table->foreignId('id_filieres')->nullable()->constrained('filieres')->onDelete('set null');
    $table->foreignId('id_jujjets')->nullable()->constrained('sujjets')->onDelete('set null');
    $table->integer('total_hours')->default(0);
    $table->foreignId('id_user')->nullable()->constrained('users')->cascadeOnDelete();;
    $table->foreignId('id_classe')->nullable()->constrained('classe')->onDelete('set null');
    $table->timestamps();
});

        // -------------------------
        // 5️⃣ etudiant
        // -------------------------
        Schema::create('etudiant', function (Blueprint $table) {
            $table->id();
            $table->string('prenom');
            $table->string('nom');
            $table->string('email')->unique();
            $table->string('telephone');
            $table->string('nom_parents');
            $table->string('telephone_parent');
            $table->string('num_carte_parent');
            $table->foreignId('id_filieres')->constrained('filieres')->onDelete('cascade');
            $table->foreignId('id_classe')->constrained('classe')->onDelete('cascade');
            $table->foreignId('id_user')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

    
        Schema::create('salle', function (Blueprint $table) {
            $table->id();
            $table->string('num_salle');
            $table->timestamps();
        });

        // -------------------------
        // 7️⃣ salle_diponible
        // -------------------------
      Schema::create('salle_diponible', function (Blueprint $table) {
    $table->id();
    $table->foreignId('salle_id')->constrained('salle')->onDelete('cascade');
    $table->foreignId('id_filiere')->constrained('filieres')->onDelete('cascade');
    $table->foreignId('id_sujjets')->constrained('sujjets')->onDelete('cascade');
    $table->foreignId('id_enseignements')->constrained('enseignements')->onDelete('cascade');
    $table->foreignId('id_classe')->constrained('classe')->onDelete('cascade');
    $table->date('jour');
    $table->time('hour_debut');
    $table->time('hour_fin');
    $table->boolean('disponible')->default(true);
    $table->timestamps();
});

        // -------------------------
        // 8️⃣ calendrier
        // -------------------------
        Schema::create('calendrier', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_enseignements')->constrained('enseignements')->onDelete('cascade');
            $table->foreignId('id_sujjets')->constrained('sujjets')->onDelete('cascade');
            $table->foreignId('id_salle')->constrained('salle')->onDelete('cascade');
            $table->foreignId('id_salle_diponible')->nullable()->constrained('salle_diponible')->onDelete('set null');
            $table->timestamps();
        });

        // -------------------------
        // 9️⃣ notes
        // -------------------------
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('etudiant')->onDelete('cascade');
            $table->foreignId('sujjet_id')->constrained('sujjets')->onDelete('cascade');
            $table->decimal('note',5,2);
            $table->foreignId('id_filieres')->constrained('filieres')->onDelete('cascade');
            $table->integer('cofficients')->default(1);
            $table->timestamps();
        });

        // -------------------------
        // 🔟 user
        // -------------------------
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role',['admin','enseignant','etudiant'])->default('etudiant');
            $table->string('remember_token')->nullable();
            $table->timestamps();
        });
       
    }

    public function down(): void
    {
        Schema::dropIfExists('user');
        Schema::dropIfExists('notes');
        Schema::dropIfExists('calendrier');
        Schema::dropIfExists('salle_diponible');
        Schema::dropIfExists('salle');
        Schema::dropIfExists('etudiant');
        Schema::dropIfExists('enseignements');
        Schema::dropIfExists('sujjets_filieres');
        Schema::dropIfExists('sujjets');
        Schema::dropIfExists('filieres');
    }
};
?>